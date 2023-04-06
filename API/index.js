const cors = require("cors");
const express = require("express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
//const { models, db } = require("./db");
const initializeDatabase = require("./db");

const { ApolloServer } = require("apollo-server-express");
//const { typeDefs, resolvers } = require('./graphql');

require("dotenv").config({ path: ".env" });

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  //const db = await connectToMongoDB();
  const { models, db } = await initializeDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context() {
      //({ db });
      return { models, db };
    },
  });

  const app = express();

  //using the graphql server as a middleware for the express server accessible via /graphql endpoint
  server.applyMiddleware({ app });

  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  //normal endpoints accessible as well
  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.listen(PORT, () => {
    console.log(`listening for requests on port ${PORT}`);
  });
};

startServer();
