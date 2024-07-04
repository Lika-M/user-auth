import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

const bcrypt = require('./signup.js');

import { connectToDatabase } from '../../../lib-db/db.js';

const options = {
    session: {
        jwt: true
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {

                let client;

                try {
                    client = await connectToDatabase();
                } catch (error) {
                    throw new Error('Database connection failed.')
                }

                const collection = client.db('user-auth').collection('users');
                const user = await collection.findOne({ email: credentials.email });

                if (!user) {
                    client.close();
                    // redirect to 404 page
                    throw new Error('No user found.');
                }

                const verifyPassword = await bcrypt.compare(credentials.password, user.password);

                if (!verifyPassword) {
                    client.close();
                    throw new Error('Invalid credentials.');
                }

                client.close();
                return { email: user.email };
            }
        })
    ]
}

const handler = NextAuth(options);

export default handler;
