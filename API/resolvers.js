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

  // Process user data into tensors
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

    //...targetUserEncodedHobbies
  ]);
  const similarities = userTensors.map((userTensor) => {
    const dotProduct = tf.sum(tf.mul(userTensor, targetUserTensor));
    const userTensorMagnitude = tf.norm(userTensor);
    const targetUserTensorMagnitude = tf.norm(targetUserTensor);
    return dotProduct
      .div(
        userTensorMagnitude.add(1e-8).mul(targetUserTensorMagnitude.add(1e-8))
      )
      .arraySync();
  });

  // Sort users by similarity and return the most compatible users
  const sortedUsers = users
    .map((user, index) => ({
      ...user._doc,
      similarity: similarities[index],
    }))
    .sort((a, b) => b.similarity - a.similarity);

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
    searchUsers: async (_, { input }, { models }) => {
      const filterAttributes = [
        input.university ? { university: input.university } : null,
        input.smoke ? { smoke: input.smoke } : null,
        input.sleepTime ? { sleepTime: input.sleepTime } : null,
        input.guests ? { guests: input.guests } : null,
        input.personality ? { personality: input.personality } : null,
        input.hygiene ? { hygiene: input.hygiene } : null,
        input.pets ? { pets: input.pets } : null,
      ];

      // Remove attributes that are not provided in the input
      const validAttributes = filterAttributes.filter(
        (attribute) => attribute !== null
      );

      const filter = {
        $and: validAttributes,
      };

      const searchResults = await models.User.find(filter);
      console.log("search results users:", searchResults);
      return searchResults;
    },
    recommendUsers: async (_, { input }, { models }) => {
      console.log("resolvers output for rec username", input.username);
      userList = await models.Recs.findOne({
        user: input.username,
      }).exec();
      console.log("recommended users:", userList["recommendedUsers"]);

      const recommendedUsers = userList["recommendedUsers"];
      // let searchResults = userList.map((user) => ({
      //   username: user.username, // Replace 'id' with the appropriate property from the user object
      //   name: user.name, // Replace 'name' with the appropriate property from the user object
      //   email: user.email, // Replace 'email' with the appropriate property from the user object
      //   bio: user.bio, // Replace 'attributes' with the appropriate property from the user object
      // }));
      // //return "recommended resolver accessed";
      //return userList["recommendedUsers"];

      //go through the usernames of each user and store the returned objects in a list of users
      async function fetchRecommendedUsers(recommendedUsers, userModel) {
        try {
          const usersPromises = recommendedUsers.map((user) =>
            userModel.findOne({ username: user.username }).exec()
          );
          // console.log("user promises from inside fetchRecUsers", userPromises);
          const users = await Promise.all(usersPromises);
          console.log("users inside fetchRecUsers", users);
          return users;
        } catch (error) {
          console.error("Error fetching recommended users:", error);
          throw error;
        }
      }
      let recUsers = fetchRecommendedUsers(recommendedUsers, models.User);
      // .then((users) => (recUsers = users)) //what are the use cases for usage of .then()?
      // .catch((error) => console.error("Error:", error));
      console.log("rec users", recUsers);

      return recUsers;
    },
    addUser: async (_, { input }, { models }) => {
      const newUser = new models.User({
        //the field names here have to correspond with the field names in the mongoose
        //schema defined in user.js

        username: input.username,
        password: input.password,
        email: input.email,
      });

      try {
        await newUser.save();
        return newUser;
      } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Failed to create user");
      }
    },

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
          return "failed login";
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
        // const filter = { username: input.username };
        // const update = {
        //   name: input.name,
        //   bio: input.biography,
        //   university: input.university,
        //   major: input.major,
        //   sleepTime: input.sleepTime,
        //   guests: input.guests,
        //   hygiene: input.cleanliness,
        //   hobbies: input.hobbies,
        //   smoke: input.smoking,
        //   pets: input.pets,
        // };

        // const options = { new: true, upsert: true };

        // const updatedProfile = await models.User.findOneAndUpdate(
        //   filter, //the filter here being the unique username from the frontend
        //   update,
        //   options
        // );

        const newUser = new models.User({
          //the field names here have to correspond with the field names in the mongoose
          //schema defined in user.js

          username: input.username,
          password: input.password,
          email: input.email,
          name: input.name,
          bio: input.biography,
          personality: input.personality,
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
            models,
            //updatedProfile
            newUser
          );

          console.log("compatible users:", compatibleUsers);
          //compiling a list of recommendations upon new user sign up
          const newRecommendation = await new models.Recs({
            _id: uuidv4(),
            user: input.username,
            //recommendedUsers: compatibleUsers,
            recommendedUsers: compatibleUsers.map((user) => ({
              _id: user._id,
              username: user.username, //can also include profile pic and email to retrieve for later
            })),
          });
          try {
            await newRecommendation.save();
            //return newRecommendation;
          } catch (err) {
            console.error("Error creating user:", err);
            throw new Error("Failed to create user");
          }

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
  },
};
