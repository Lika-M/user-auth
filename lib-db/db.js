const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user:kaQ2vugMJ56JhTg2@atlascluster.tcca3nt.mongodb.net/?appName=AtlasCluster";

export function connectToDatabase() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    return client.connect();
}

export async function insertUserCredentials(client, document) {
    const db = client.db('user-auth');
    const collection = await db.collection('user');
    const result = await collection.insertOne(document);
    return result;
}