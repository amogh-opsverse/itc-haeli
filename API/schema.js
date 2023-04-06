const { gql } = require("apollo-server");

const typeDefs = gql`
  enum Frequency {
    OFTEN
    SOMETIMES
    NEVER
  }

  type User {
    #id: ID!
    name: String
    password: String
    email: String
    username: String
    bio: String
    imgUrl: String
    university: String
    major: String
    sleepTime: Int
    hygiene: Frequency
    hobbies: [String]
    smoke: Boolean
    pets: Boolean
    createdAt: Int
    similarity: Int
  }

  type ProfileInfo {
    username: User
  }

  type AddUserProfileResult {
    profile: User
    compatibleUsers: [User]
  }

  #enforces the structure and contents of clientside json req payload

  input NewUserInput {
    #id: String!
    password: String!
    email: String!
    username: String!
    #createdAt: Int!
  }

  input UserProfile {
    #id: ID!
    username: String!
    password: String!
    email: String!
    name: String!
    biography: String!
    personality: String!
    image: String!
    university: String!
    major: String!
    sleepTime: String!
    cleanliness: Frequency!
    guests: Frequency!
    hobbies: [String!]!
    smoking: String!
    pets: String!
  }

  input UserInputUniversity {
    university: String!
  }

  input UserInputLogin {
    username: String!
    password: String!
  }

  input UniqueID {
    username: String!
    email: String!
    password: String!
  }

  input UserSearch {
    university: String
    smoke: String
    sleepTime: String
    guests: String
    personality: String
    hygiene: String
    pets: String
  }

  input UserRecs {
    username: String!
  }

  type Query { #the query can be of any name but the input type and return types are usually defined in the schema
    usertestID(userID: String!): User! #a query which can be used to get user details based on user id
  }

  type Mutation {
    addUser(input: NewUserInput!): User!
    addUserProfile(input: UserProfile): User! #mutation definition to add profile info to the user
    verifyUniqueness(input: UniqueID): String! #used to check if username already exists during signup
    userLogin(input: UserInputLogin!): User!
    searchUsers(input: UserSearch): [User]
    recommendUsers(input: UserRecs): [User]
  }
`;

module.exports = typeDefs;
