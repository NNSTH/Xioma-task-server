const bcrypt = require('bcrypt');
const fs = require('fs/promises')

const { getCollection } = require('../../utils/db')

exports.login = async (req, res) => {
    try {
        const usersCollection = await getCollection('users')

        const { username, password } = req.body;
        const user = await usersCollection.findOne({ username });

        if (user) {
            const correctPassword = await bcrypt.compare(password, user.password)
            if (correctPassword) {
                res.json({ message: 'Login successful', user });
            }
            else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    console.log('loged out!')
};

exports.register = async (req, res) => {
    try {
        const usersCollection = await getCollection('users')

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await usersCollection.insertOne({ username, password: hashedPassword });

        res.json({ message: 'User registered', userId: result.insertedId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.insertFakeUsers = async (req, res) => {
    try {
        const usersCollection = await getCollection('users')

        const usersData = await fs.readFile('./mock_data/users.json');
        const users = JSON.parse(usersData)

        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 10);
        }

        const result = await usersCollection.insertMany(users);

        res.json({ message: 'Fake users inserted' });
    }
    catch (error) {
        console.error('Insert fake users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getAll = async (req, res) => {
    try {
        const usersCollection = await getCollection('users')

        const result = await usersCollection.find({}, { projection: { _id: 1, username: 1 } }).toArray();
        const jsonDocs = JSON.stringify(result);
        res.json({ data: JSON.parse(jsonDocs) });

    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.deleteUsersCollection = async (req, res) => {
    try {
        const usersCollection = await getCollection('users')

        await usersCollection.drop();
        res.json({ message: 'OK' });

    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}