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
    sleepTime: String
    personality: String
    gender: String
    hygiene: Frequency
    hobbies: [String]
    smoke: String
    # savedImages: [String]
    pets: String
    savedImages: [SavedImage]
    collectionPublic: Boolean
    profilePublic: Boolean
    createdAt: Int
    similarity: Float
  }

  type SavedImage {
    imgUrl: String
    prompt: String
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
    username: String
    password: String
    email: String
    name: String
    biography: String
    personality: String
    gender: String
    image: String
    university: String
    major: String
    sleepTime: String
    cleanliness: Frequency
    guests: Frequency
    hobbies: [String]
    smoking: String
    pets: String
  }

  input UserEditProfile {
    #id: ID!
    username: String
    password: String
    email: String
    biography: String
    image: String
    university: String
    major: String
    sleepTime: String
    cleanliness: Frequency
    guests: Frequency
    hobbies: [String]
    smoking: String
    pets: String
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
    user: String
    university: String
    smoke: String
    sleepTime: String
    guests: String
    personality: String
    gender: String
    hygiene: String
    pets: String
  }

  input UserElasticSearch {
    query: String
  }

  input UserRecs {
    username: String!
  }

  input GenerateDesigns {
    prompt: String
  }

  input GetUserDesigns {
    username: String!
  }

  input SaveDesign {
    username: String!
    imgSrc: String
    imgPrompt: String
  }

  input DeleteDesign {
    username: String!
    imgSrc: String
  }

  input CollectionPrivacy {
    username: String!
    collectionPublic: Boolean
    profilePublic: Boolean
    privacyType: String
  }

  input ContactUser {
    senderEmail: String!
    receiverEmail: String!
  }

  # input ProfilePrivacy {
  #   username: String!
  #   profilePublic: Boolean
  # }

  type Query { #the query can be of any name but the input type and return types are usually defined in the schema
    usertestID(userID: String!): User! #a query which can be used to get user details based on user id
  }

  type Mutation {
    addUser(input: NewUserInput!): User!
    addUserProfile(input: UserProfile): User! #mutation definition to add profile info to the user
    editUserProfile(input: UserEditProfile): User #mutation definition to add profile info to the user
    verifyUniqueness(input: UniqueID): String! #used to check if username already exists during signup
    userLogin(input: UserInputLogin!): User!
    searchUsers(input: UserSearch): [User]
    recommendUsers(input: UserRecs): [User]

    #change collection privacy
    #togglePrivacy(input: CollectionPrivacy): String
    togglePrivacy(input: CollectionPrivacy): User
    getUserPrivacy(input: CollectionPrivacy): Boolean
    #profilePrivacy(input: ProfilePrivacy): String

    #dall-e generation
    getUserDesigns(input: GetUserDesigns): [SavedImage]
    createDesigns(input: GenerateDesigns): [String]
    deleteDesign(input: DeleteDesign): String
    saveUserDesign(input: SaveDesign): String

    #elasticsearch
    elasticSearch(input: UserElasticSearch): [User]

    #courier api
    contactUser(input: ContactUser): String
  }
`;

module.exports = typeDefs;
