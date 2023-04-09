const tf = require("@tensorflow/tfjs");
const { v4: uuidv4 } = require("uuid");
const Redis = require("ioredis");

function getNewRedisClient() {
  const client = new Redis({
    // Add your configuration options here, if needed
    password: "DLtLfalG0P1q4DEC6NZIQB54Z23WCImL",
    host: "redis-15161.c246.us-east-1-4.ec2.cloud.redislabs.com",
    port: 15161,
  });
  console.log("New Redis client created");

  return client;
}

function generateCacheKey(input) {
  return Object.entries(input)
    .sort()
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

const possibleHobbies = ["reading", "sports", "music", "gaming", "cooking"];

function oneHotEncodeHobbies(hobbies) {
  //match based on hobbies later?
  const encodedHobbies = possibleHobbies.map((hobby) =>
    hobbies.includes(hobby) ? 1 : 0
  );
  return encodedHobbies;
}

//finding compatible users:
async function findCompatibleUsers(models, targetUser) {
  //to normalize the string values to numerical
  const frequency = {
    OFTEN: 1,
    SOMETIMES: 2,
    NEVER: 3,
  };

  const gender = {
    male: 1,
    female: 2,
  };

  const major = {
    "Computer Science": 1,
    "Mechanical Engineering": 2,
    "Electrical Engineering": 3,
    "Civil Engineering": 4,
    Physics: 5,
    Mathematics: 6,
  };

  const boo = {
    yes: 1,
    no: 0,
  };

  const personality = {
    introvert: 1,
    extrovert: 2,
    ambivert: 3,
  };

  const sleepTime = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };

  //const encodedValue = categories[user.pets];

  // Fetch all users
  const users = await models.User.find({});
  // const users = await models.User.find({
  //   //culprit for not finding the recommended users
  //   university: targetUser.university,
  //   major: targetUser.major,
  // }).select("username major smoke pets guests sleepTime hygiene personality");

  // Process user data into tensors and store in userTensors
  const userTensors = users.map((user) => {
    //const encodedHobbies = oneHotEncodeHobbies(user.hobbies);
    // Convert user data into a tensor
    // (Modify this to use the features you want to consider for compatibility)
    return tf.tensor([
      // user.hobbies,
      major[user.major] || 0,
      boo[user.smoke] || 0,
      boo[user.pets] || 0,
      frequency[user.guests] || 0,
      sleepTime[user.sleepTime] || 0,
      frequency[user.hygiene] || 0,
      personality[user.personality] || 0,
      gender[user.gender] || 0,
      //...encodedHobbies
    ]);
  });

  // Compute the cosine similarity between the target user and all other users
  //const targetUserEncodedHobbies = oneHotEncodeHobbies(targetUser.hobbies);
  const targetUserTensor = tf.tensor([
    //targetUser.hobbies,
    major[targetUser.major] || 0,
    boo[targetUser.smoke] || 0,
    boo[targetUser.pets] || 0,
    frequency[targetUser.guests] || 0,
    sleepTime[targetUser.sleepTime] || 0,
    frequency[targetUser.hygiene] || 0,
    personality[targetUser.personality] || 0,
    gender[targetUser.gender] || 0,

    //...targetUserEncodedHobbies
  ]);

  //calculate similarity score for each userTensor in the userTensors array
  // const similarities = userTensors.map((userTensor) => {
  //   const dotProduct = tf.sum(tf.mul(userTensor, targetUserTensor));
  //   const userTensorMagnitude = tf.norm(userTensor);
  //   const targetUserTensorMagnitude = tf.norm(targetUserTensor);
  //   return dotProduct
  //     .div(
  //       userTensorMagnitude.add(1e-8).mul(targetUserTensorMagnitude.add(1e-8))
  //     )
  //     .arraySync();
  // });
  const similarities = await Promise.all(
    userTensors.map(async (userTensor) => {
      const dotProduct = tf.sum(tf.mul(userTensor, targetUserTensor));
      const userTensorMagnitude = tf.norm(userTensor);
      const targetUserTensorMagnitude = tf.norm(targetUserTensor);
      return dotProduct
        .div(
          userTensorMagnitude.add(1e-8).mul(targetUserTensorMagnitude.add(1e-8))
        )
        .arraySync();
    })
  );

  // Sort users by similarity and return the most compatible users
  const sortedUsers = users
    .map((user, index) => ({
      ...user._doc,
      similarity: similarities[index],
    }))
    .sort((a, b) => b.similarity - a.similarity);

  console.log("sorted users recommender function", sortedUsers);
  return sortedUsers.slice(1); // Exclude the target user from the result
}

//the resolvers are used to assign business logic to the graphql schema
//for example, the user query below corresponds with the user(..) field defined in the query type
//in schema.js //the { input } is the input from the client which has to conform to the input parameter of input type
//UserInput defined in the schema. the resolvers get executed whenever a query is made with the query name matching one of the
//query fields defined in the query type (schema.js)
module.exports = {
  Query: {
    async usertestID(_, { userID }, { models }) {
      console.log("Input:", userID);
      try {
        const user = await models.User.findOne({
          _id: userID,
        }).exec();
        console.log("User:", user);
        return user;
      } catch (error) {
        console.error("Error in user resolver:", error);
        throw error;
      }
    },
  },
  Mutation: {
    verifyUniqueness: async (_, { input }, { models }) => {
      //if user exists with either the same username or email
      let uniqueUsername = await models.User.findOne({
        username: input.username,
      }).exec();

      if (uniqueUsername) {
        return "username already taken";
      } else {
        return "username available";
      }
    },
    searchUsers: async (_, { input, skip = 0, limit = 100 }, { models }) => {
      const filterAttributes = [
        input.university ? { university: input.university } : null,
        input.smoke ? { smoke: input.smoke } : null,
        input.sleepTime ? { sleepTime: input.sleepTime } : null,
        input.guests ? { guests: input.guests } : null,
        input.personality ? { personality: input.personality } : null,
        input.gender ? { gender: input.gender } : null,
        input.hygiene ? { hygiene: input.hygiene } : null,
        input.pets ? { pets: input.pets } : null,
      ];

      // Remove attributes that are not provided in the input
      const validAttributes = filterAttributes.filter(
        (attribute) => attribute !== null
      );

      // const filter = {
      //   $and: validAttributes,
      // };
      const filter = {
        $and: [
          ...validAttributes,
          { username: { $ne: input.user } }, // Exclude logged-in user based on their ID
        ],
      };

      //const searchResults = await models.User.find(filter);

      const searchResults = await models.User.find(filter)
        .skip(skip)
        .limit(limit);
      console.log("search results users:", searchResults);
      return searchResults;
      // const filterAttributes = [
      //   input.university ? { university: input.university } : null,
      //   input.smoke ? { smoke: input.smoke } : null,
      //   input.sleepTime ? { sleepTime: input.sleepTime } : null,
      //   input.guests ? { guests: input.guests } : null,
      //   input.personality ? { personality: input.personality } : null,
      //   input.hygiene ? { hygiene: input.hygiene } : null,
      //   input.pets ? { pets: input.pets } : null,
      // ];

      // const validAttributes = filterAttributes.filter(
      //   (attribute) => attribute !== null
      // );

      // const filter = {
      //   $and: validAttributes,
      // };

      // // Generate a unique cache key based on the input filters
      // const cacheKey = generateCacheKey(input);

      // // Check if the search results are available in the Redis cache
      // const redisClient = getNewRedisClient();
      // const cachedResults = await redisClient.get(cacheKey);

      // if (cachedResults) {
      //   console.log("Using cached results");
      //   return JSON.parse(cachedResults);
      // }

      // const searchResults = await models.User.find(filter)
      //   .skip(skip)
      //   .limit(limit);
      // console.log("Search results users:", searchResults);

      // // Cache the search results in Redis with an expiration time (e.g. 1 hour)
      // await redisClient.setex(cacheKey, 3600, JSON.stringify(searchResults));
      // redisClient.quit();

      // return searchResults;
    },
    recommendUsers: async (_, { input, skip = 0, limit = 10 }, { models }) => {
      user = await models.User.findOne({
        username: input.username,
      }).exec();
      const compatibleUsers = await findCompatibleUsers(
        //calling the tensorflow function implementation for comparing cosine similarities
        //returns a list of compatible users
        models,
        user
      );

      console.log("compatible users:", compatibleUsers);
      //compiling a list of recommendations upon new user sign up
      //stores the list of compatible users for the user that just signed up
      // const updateRecommendation = await new models.Recs({
      //   _id: uuidv4(),
      //   user: input.username,
      //   //recommendedUsers: compatibleUsers,
      //   recommendedUsers: compatibleUsers.map((user) => ({
      //     _id: user._id,
      //     username: user.username, //can also include profile pic and email to retrieve for later
      //     similarity: user.similarity, //storing the similarity value to be displayed as part of the recommended results
      //   })),
      // });
      const updateRecommendation = await models.Recs.findOneAndUpdate(
        { user: input.username }, // Find the document by username
        {
          $set: {
            // Update the fields
            user: input.username,
            recommendedUsers: compatibleUsers.map((user) => ({
              _id: user._id,
              username: user.username,
              similarity: user.similarity,
            })),
          },
        },
        {
          upsert: true, // Create a new document if it does not exist
          new: true, // Return the updated document
        }
      );
      try {
        await updateRecommendation.save(); //saving the changes to db
        //return newRecommendation;
      } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Failed to create user");
      }

      console.log("resolvers output for rec username", input.username);

      //call the recommender system again to update the recommendations to handle new user signups

      //fetching the existing list of recommended user data for the logged in user
      userList = await models.Recs.findOne({
        user: input.username,
      }).exec();
      console.log("recommended users:", userList["recommendedUsers"]);

      const recommendedUsersResult = userList["recommendedUsers"];

      //go through the usernames of each user returned from the above function and store the returned objects in a list of users
      async function fetchRecommendedUsers(recommendedUsers, userModel) {
        try {
          //find the corresponding User obj from User document and store in the userList
          const usersPromises = recommendedUsers.map(
            (
              user //store the corresponding User obj for each user in the recommendations list
            ) =>
              userModel
                .findOne({ username: user.username })
                // .skip(skip)
                // .limit(limit)
                .exec() //arrow function
          );
          //go through the list of User objects but how to get

          //list of recommended users
          const users = await Promise.all(usersPromises);

          //adding the similarity attribute to the response of each user object returned from the User table
          const recUsersSimilarityScore = recommendedUsers.map(
            (user, index) => ({
              ...users[index]._doc,
              similarity: user.similarity,
            })
          );
          console.log("users inside fetchRecUsers", users);
          console.log(
            "users inside fetchRecUsers with similarity score",
            recUsersSimilarityScore
          );
          //return the above payload with the similarity score added
          return recUsersSimilarityScore;
        } catch (error) {
          console.error("Error fetching recommended users:", error);
          throw error;
        }
      }
      console.log(
        "recommended users returned from recommended function",
        recommendedUsersResult
      );
      let recUsers = fetchRecommendedUsers(recommendedUsersResult, models.User); //recUser objects from User document

      // .then((users) => (recUsers = users)) //what are the use cases for usage of .then()?
      // .catch((error) => console.error("Error:", error));
      console.log("rec users:", recUsers);

      return recUsers;
    },
    // addUser: async (_, { input }, { models }) => {
    //   const newUser = new models.User({
    //     //the field names here have to correspond with the field names in the mongoose
    //     //schema defined in user.js

    //     username: input.username,
    //     password: input.password,
    //     email: input.email,
    //   });

    //   try {
    //     await newUser.save();
    //     return newUser;
    //   } catch (err) {
    //     console.error("Error creating user:", err);
    //     throw new Error("Failed to create user");
    //   }
    // },

    async userLogin(_, { input }, { models }) {
      //trying out redis
      console.log("Input:", input);
      try {
        // First, try to get the user from the Redis cache
        const redisClient = getNewRedisClient();
        console.log("Using Redis client");

        const redisKey = `user:${input.username}`;
        const cachedUser = await redisClient.get(redisKey).then(JSON.parse);

        let user;

        // If the user is found in the cache, use it
        if (cachedUser) {
          console.log("User found in cache:", cachedUser);
          user = cachedUser;
        } else {
          // If the user is not in the cache, query the database
          user = await models.User.findOne({
            username: input.username,
          }).exec();

          // Store the user in the Redis cache
          await redisClient.set(redisKey, JSON.stringify(user), "EX", 3600); // Cache for 1 hour
          console.log("User fetched from database:", user);
        }

        redisClient.quit();

        console.log("User:", user);
        console.log("resolver password:", input.password);

        // Perform password validation
        console.log("password", input.password);
        if (user.password != input.password) {
          console.error("Error in validating user resolver:");
          throw error;
          //return "failed login";
        } else {
          return user;
        }
      } catch (error) {
        console.error("Error in user resolver:", error);
        throw error;
      }
    },
    addUserProfile: async (_, { input }, { models }) => {
      try {
        /*implement below logic for updateUserProfile() mutation*/

        const newUser = new models.User({
          //the field names here have to correspond with the field names in the mongoose
          //schema defined in user.js

          username: input.username,
          password: input.password,
          email: input.email,
          name: input.name,
          bio: input.biography,
          personality: input.personality,
          gender: input.gender,
          imgUrl: input.image,
          university: input.university,
          major: input.major,
          sleepTime: input.sleepTime,
          guests: input.guests,
          hygiene: input.cleanliness,
          hobbies: input.hobbies,
          smoke: input.smoking,
          pets: input.pets,
        });

        try {
          await newUser.save();
          if (!newUser) {
            throw new Error("Failed to create user profile");
          }

          const compatibleUsers = await findCompatibleUsers(
            //calling the tensorflow function implementation for comparing cosine similarities
            //returns a list of compatible users
            models,
            //updatedProfile
            newUser
          );

          console.log("compatible users:", compatibleUsers);
          //compiling a list of recommendations upon new user sign up
          //stores the list of compatible users for the user that just signed up
          const newRecommendation = await new models.Recs({
            _id: uuidv4(),
            user: input.username,
            //recommendedUsers: compatibleUsers,
            recommendedUsers: compatibleUsers.map((user) => ({
              _id: user._id,
              username: user.username, //can also include profile pic and email to retrieve for later
              similarity: user.similarity, //storing the similarity value to be displayed as part of the recommended results
            })),
          });
          try {
            await newRecommendation.save(); //saving the changes to db
            //return newRecommendation;
          } catch (err) {
            console.error("Error creating user:", err);
            throw new Error("Failed to create user");
          }

          //update the user object in the recommendations list with the similarity score:
          //similarity score cannot be a direct field in the original user schema because it is subjective for each user and can overlap (not specific to a user)
          //return newly created user;

          return newUser;
        } catch (err) {
          console.error("Error creating user:", err);
          throw new Error("Failed to create user");
        }
      } catch (err) {
        console.error("Error updating user profile:", err);
        throw new Error("Failed to update user profile");
      }
    },
    //finds the user object by username and updates the document with the passed in attrs
    //calls the recommender system to update the recs document with the latest recommendations for
    //the passed in user (similar to the addUser flow)
    editUserProfile: async (_, { input }, { models }) => {
      const filter = { username: input.username };
      const update = {
        //the input would have to be passed in from the root state (Home.tsx)
        //name: input.name,
        bio: input.biography,
        university: input.university,
        major: input.major,
        sleepTime: input.sleepTime,
        guests: input.guests,
        hygiene: input.cleanliness,
        hobbies: input.hobbies,
        smoke: input.smoking,
        pets: input.pets,
      };

      const options = { new: true, upsert: true };

      const updatedProfile = await models.User.findOneAndUpdate(
        filter, //the filter here being the unique username from the frontend
        update,
        options
      );

      console.log("updated user profile:", updatedProfile);
    },
  },
};
