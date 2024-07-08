import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from '../../../lib-db/db.js';
const bcrypt = require('./signup.js');

const secret = process.env.NEXTAUTH_SECRET;

export const authOptions = {
    session: {
        jwt: true,
    },
    secret: secret,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                let client;

                try {
                    client = await connectToDatabase();
                } catch (error) {
                    throw new Error('Database connection failed.');
                }

                const collection = client.db('user-auth').collection('users');
                const user = await collection.findOne({ email: credentials.email });

                if (!user) {
                    client.close();
                    throw new Error('No user found.');
                }

                const verifyPassword = await bcrypt.compare(credentials.password, user.password);

                if (!verifyPassword) {
                    client.close();
                    throw new Error('Invalid credentials.');
                }

                client.close();
                return { email: user.email, name: null, image: null};
            }
        })
    ]
};

export default NextAuth(authOptions);
