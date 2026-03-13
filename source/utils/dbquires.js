const connectDB = require("../db/mongo");

/**
 * Insert document
 */
async function insertData(collectionName, data) {
  const db = await connectDB();

  const result = await db.collection(collectionName).insertOne(data);

  return result;
}

/**
 * Update document
 */
async function updateData(collectionName, filter, updateData) {
  const db = await connectDB();

  const result = await db
    .collection(collectionName)
    .updateOne(filter, { $set: updateData });

  return result;
}

/**
 * Delete document
 */
async function deleteData(collectionName, filter) {
  const db = await connectDB();

  const result = await db.collection(collectionName).deleteOne(filter);

  return result;
}

/**
 * Get one document
 */
async function getOne(collectionName, filter, sort = {}) {
  const db = await connectDB();

  const result = await db
    .collection(collectionName)
    .findOne(filter, { sort });

  return result;
}

/**
 * Get multiple documents
 */
async function getMany(collectionName, filter = {}) {
  const db = await connectDB();

  const result = await db.collection(collectionName).find(filter).toArray();

  return result;
}

module.exports = {
  insertData,
  updateData,
  deleteData,
  getOne,
  getMany,
};
