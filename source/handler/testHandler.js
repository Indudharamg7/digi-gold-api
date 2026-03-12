const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

let client;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB Connected");
  }

  return client.db("digi_gold");
}

module.exports = connectDB;