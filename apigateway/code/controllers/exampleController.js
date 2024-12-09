import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const userList = []; // Temporary in-memory storage

export async function addUser(req, res) {
    if (!req.body.name || !req.body.password || !req.body.email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const userExists = userList.some((user) => user.user === req.body.name);
    if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(req.body.password, 10);
    const newUser = {
        user: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    };
    userList.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
}

export async function loginUser(req, res) {
    const user = userList.find((u) => u.user === req.body.name);
    if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
    }
    if (await compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken({ user: req.body.name });
        res.json({ accessToken, message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Incorrect password' });
    }
}

export async function logoutUser(req, res) {
    // Logout logic placeholder
    res.status(204).send('Logged out');
}

function generateAccessToken(user) {
    return sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}
