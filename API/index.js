const cors = require("cors");
const express = require("express");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
//const { models, db } = require("./db");
const initializeDatabase = require("./db");

const { ApolloServer } = require("apollo-server-express");
const { connect } = require("mongoose");
//import { Pool, Client } from "pg";
const Pool = require("pg").Pool;
//const { typeDefs, resolvers } = require('./graphql');

require("dotenv").config({ path: ".env" });

const PORT = process.env.PORT || 3000;

const config = {
  user: "bruh",
  password: "Shashi@123",
  database: "postgres",
  host: "34.173.198.96",
};

const startServer = async () => {
  //test the cloudsql connection
  const pool = new Pool(config);

  async function connection() {
    await pool.connect((err, client, release) => {
      if (err) {
        console.log("Error connecting to the database", err.stack);
        return;
      }
      console.log("connected to db");
      client.query("SELECT NOW()", (err, result) => {
        release();
        if (err) {
          context.log("Error executing query", err.stack);
          return;
        }
        console.log("Successfully executed query", result.rows);
      });
    });
  }
  await connection();
  //end of test connection to google cloudsql

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

  //app.use(express.json());
  app.use(express.json({ limit: "50mb" }));
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
