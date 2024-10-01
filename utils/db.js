const { MongoClient } = require('mongodb');
const config = require('./config');

let client;

const connectToDatabase = async () => {
    if (!client) {
        client = new MongoClient(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log(`Connected to MongoDB at ${config.dbUri}`);
    }
    return client.db('xioma');
}

const getCollection = async (collectionName) => {
    const db = await connectToDatabase();
    const tasksCollection = db.collection(collectionName);

    return tasksCollection
}

module.exports = {
    connectToDatabase,
    getCollection
};
