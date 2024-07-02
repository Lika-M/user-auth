const bcrypt = require('bcrypt');

import { connectToDatabase, insertUserCredentials } from "../../../lib-db/db.js";

async function handler(req, res) {

    if (req.method === "POST") {
    
        const { email, password } = req.body;
        const isInvalid = !email || !password || !email.includes('@') || password.trim().length <6;

        if (isInvalid) {
            res.status(422).json({ message: 'Invalid user data.' });
            return;
        }

        const hashedPass = await bcrypt.hash(password, 12);
        console.log(hashedPass)

        const userData = {
            email,
            password: hashedPass,
            createdAt: new Date().toISOString()
        }

        let client;

        try {
            client = await connectToDatabase();
        } catch (error) {
            res.status(500).json({ message: "DB connection failed." });
            await client.close();
            return;
        }

        try {
            const result = await insertUserCredentials(client, userData);
            res.status(201).json({ message: "Signup successful.", data: result })
        } catch (error) {
            res.status(500).json({ message: error.message })
            await client.close();
            return;
        } 
    } else {
        res.status(422).json({ message: 'Invalid method' })
    }
}

export default handler;