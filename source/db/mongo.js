const { MongoClient } = require("mongodb");
const { getSecrets } = require("../utils/secretkeyloader");

let db;

const connectDB = async () => {
  try {
    if (db) return db;
    const secrets = await getSecrets();
    const uri = `mongodb+srv://serverless_user:${secrets.MONGO_DB_PASSWORD}@test-db.rpn1dgh.mongodb.net/digi_gold`;
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB Successfully");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = connectDB;
