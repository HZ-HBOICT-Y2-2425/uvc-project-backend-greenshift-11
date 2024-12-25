import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

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
        categories: []
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

  export async function updateUserCategories(req, res) {
    try {
        const { user, categories } = req.body;

        if (!user || !categories) {
            return res.status(400).json({ message: 'User and categories are required' });
        }

        // Load the database
        const db = readDatabase();
        const foundUser = db.users.find((u) => u.user === user);

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update categories
        console.log("Before update:", foundUser.categories);
        foundUser.categories = categories;
        writeDatabase(db);
        console.log("After update:", foundUser.categories);

        res.status(200).json({ message: 'Categories updated successfully', categories: foundUser.categories });
    } catch (error) {
        console.error('Error updating categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
}

export async function updateUserTasks(req, res){
  try {
    const { user, tasks } = req.body;

    if (!user || !tasks) {
      return res.status(400).json({ message: "User and tasks are required." });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update tasks for the user
    foundUser.tasks = tasks;
    writeDatabase(db);

    res.status(200).json({ message: "Tasks updated successfully", tasks });
  } catch (error) {
    console.error("Error updating user tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getTasksByCategory = (req, res) => {
  const { category } = req.params;
  if (tasks[category]) {
    res.status(200).json({ tasks: tasks[category] });
  } else {
    res.status(404).json({ error: "Category not found" });
  }
};

export async function proxyUpdateTasksByCategory(req, res) {
  const { category } = req.params;
  const { tasks } = req.body;

  try {
    const response = await fetch(`http://localhost:3011/api/tasks/${category}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying task update:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

