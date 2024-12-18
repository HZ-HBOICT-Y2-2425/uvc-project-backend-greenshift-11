import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import fs from 'fs';
import path from 'path';

// Get the absolute path to the db.json file
const dbPath = path.resolve('./db.json');

// Helper function to read from db.json
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to db.json
const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

export async function addUser(req, res) {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const db = readDatabase();
      const userExists = db.users.some((user) => user.user === name);
  
      if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await hash(password, 10);
  
      const newUser = {
        id: db.users.length + 1,
        user: name,
        email,
        password: hashedPassword,
        currency: 0,
        notes: [],
      };
  
      db.users.push(newUser);
      writeDatabase(db);
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  export async function loginUser(req, res) {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }

        // Load users from db.json
        const db = readDatabase();
        const user = db.users.find((u) => u.user === name);

        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        // Compare provided password with hashed password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate an access token
        const accessToken = generateAccessToken({ user: user.user });

        res.json({ accessToken, username: user.user, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function logoutUser(req, res) {
    // Logout logic placeholder
    res.status(204).send('Logged out');
}

function generateAccessToken(user) {
    return sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

//get all users
export async function getUsers(req, res) {
    try {
      const db = readDatabase();
      res.status(200).json(db.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// Add a note for a user
export async function addNote(req, res) {
    try {
      const { user, note, date } = req.body;
  
      const db = readDatabase();
      const foundUser = db.users.find((u) => u.user === user);
  
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!note || !date) {
        return res.status(400).json({ message: 'Note and date are required' });
      }
  
      foundUser.notes.push({ date, note });
      writeDatabase(db);
  
      res.status(201).json({ message: 'Note added successfully', notes: foundUser.notes });
    } catch (error) {
      console.error('Error adding note:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// Get notes for a user
export async function getNotes(req, res) {
    try {
      const { user } = req.params;
  
      const db = readDatabase();
      const foundUser = db.users.find((u) => u.user === user);
  
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ notes: foundUser.notes });
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  export async function updateUser(req, res) {
    try {
      const { name, email, currentPassword, newPassword } = req.body;
      const { user } = req.params;
  
      // Load database
      const db = readDatabase();
      const foundUser = db.users.find((u) => u.user === user);
  
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Verify current password if provided
      if (currentPassword) {
        const isPasswordValid = await compare(currentPassword, foundUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }
      }
  
      // Update fields
      if (name) foundUser.user = name;
      if (email) foundUser.email = email;
      if (newPassword) {
        const hashedPassword = await hash(newPassword, 10);
        foundUser.password = hashedPassword;
      }
  
      // Save updates to the database
      writeDatabase(db);
  
      res.status(200).json({ message: 'User updated successfully', user: foundUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  