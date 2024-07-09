import bcrypt from "bcrypt";

import { checkUserExists, connectToDatabase, insertUserCredentials } from "../../../lib-db/db.js";

async function handler(req, res) {

    if (req.method === "POST") {

        const { email, password } = req.body;
        const isInvalid = !email || !password || !email.includes('@') || password.trim().length < 6;

        if (isInvalid) {
            res.status(422).json({ message: 'Invalid user data.' });
            return;
        }

        let client;

        try {
            client = await connectToDatabase();
            console.log('connected')
        } catch (error) {
            res.status(500).json({ message: "DB connection failed." });
            await client.close();
            return;
        }

        try {
            const existingUser = await checkUserExists(client, email);
            if (existingUser) {
                res.status(422).json({ message: 'User registered already.' });
                return;
            }
        } catch (error) {
            res.status(500).json({ message: "DB connection failed." });
            await client.close();
            return;
        }

        const hashedPass = await bcrypt.hash(password, 12);

        const userData = {
            email,
            password: hashedPass,
            createdAt: new Date().toISOString()
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
export { bcrypt };