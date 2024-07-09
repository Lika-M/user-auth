import { getServerSession } from 'next-auth/next';

import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '../../../lib-db/db.js';
import { bcrypt } from '../auth/signup.js'

async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return;
    }
    // check user auth 
    const session = await getServerSession(req, res, authOptions);
    console.log(session)

    if (!session) {
        res.status(401).json({ message: 'Not authenticated!' })
        return;
    }

    const userEmail = session.user.email;

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;


    let client;

    try {
        client = await connectToDatabase();
        console.log('connected')
    } catch (error) {
        res.status(500).json({ message: "DB connection failed." });
        return;
    }

    const collection = client.db('user-auth').collection('users');
    const user = await collection.findOne({ email: userEmail });

    if (!user) {
        await client.close();
        res.status(404).json({ message: 'User not found.' });
        return;
    }

    const currentPassword = user.password;
    const matchedPasswords = await bcrypt.compare(oldPassword, currentPassword);

    if (!matchedPasswords) {
        await client.close();
        res.status(422).json({ message: 'Invalid password.' })
        return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    try {
        const result = await collection.updateOne(
            { email: userEmail },
            { $set: { password: hashedNewPassword } }
        );

        res.status(201).json({ message: 'Password updated.' });
        console.log(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    } finally {
        if (client) {
            await client.close();
        }
    }
}

export default handler;