const { MongoClient, ServerApiVersion } = require('mongodb');
const { uri } = require('../config.js');

export async function connectToDatabase() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log("Connected successfully to database");
        return client;
    } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("DB connection failed.");
    }
}

export async function insertUserCredentials(client, document) {
    const db = client.db('user-auth');
    const collection = await db.collection('users');
    const result = await collection.insertOne(document);
    return result;
}

export async function checkUserExists(client, email) {
    const db = client.db('user-auth');
    const collection = await db.collection('users');
    const result = await collection.findOne({ email: email });
    return result;
}