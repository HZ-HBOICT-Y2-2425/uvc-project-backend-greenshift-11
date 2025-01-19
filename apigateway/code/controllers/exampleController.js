import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { query } from "../db/mariadb.js";

const dbPath = path.resolve('./db.json');

const readDatabase = () => {
 const data = fs.readFileSync(dbPath, 'utf-8');
 return JSON.parse(data);
};

const writeDatabase = (data) => {
 fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

export async function getItems(req, res) {
  try {
    const db = readDatabase();
    res.status(200).json(db.items);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

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
     currency: 500, // Starting currency
     inventory: [], // Initialize inventory
     notes: [],
     completedTasks: [],
     streakCount: 0,
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

   const db = readDatabase();
   const user = db.users.find((u) => u.user === name);

   if (!user) {
     return res.status(404).json({ message: 'User does not exist' });
   }

   const isPasswordValid = await compare(password, user.password);
   if (!isPasswordValid) {
     return res.status(401).json({ message: 'Incorrect password' });
   }

   const accessToken = generateAccessToken({ user: user.user });

   res.json({ accessToken, username: user.user, message: 'Login successful' });
 } catch (error) {
   console.error('Error during login:', error);
   res.status(500).json({ message: 'Internal server error' });
 }
}

export async function getCurrency(req, res) {
 try {
   const { user } = req.params;
   const db = readDatabase();
   const foundUser = db.users.find((u) => u.user === user);
   
   if (!foundUser) {
     return res.status(404).json({ message: 'User not found' });
   }
   
   res.status(200).json({ currency: foundUser.currency });
 } catch (error) {
   res.status(500).json({ message: 'Internal server error' });
 }
}

export async function getInventory(req, res) {
 try {
   const { user } = req.params;
   const db = readDatabase();
   const foundUser = db.users.find((u) => u.user === user);
   
   if (!foundUser) {
     return res.status(404).json({ message: 'User not found' });
   }
   
   res.status(200).json({ inventory: foundUser.inventory || [] });
 } catch (error) {
   res.status(500).json({ message: 'Internal server error' });
 }
}

export async function purchaseItem(req, res) {
 try {
   const { user, itemId, type, price } = req.body;
   const db = readDatabase();
   const foundUser = db.users.find((u) => u.user === user);

   if (!foundUser) {
     return res.status(404).json({ message: 'User not found' });
   }

   if (foundUser.currency < price) {
     return res.status(400).json({ message: 'Insufficient funds' });
   }

   foundUser.inventory = foundUser.inventory || [];
   
   const existingItem = foundUser.inventory.find(i => i.itemId === itemId && i.type === type);
   if (existingItem) {
     if (existingItem.quantity >= 5) {
       return res.status(400).json({ message: 'Maximum quantity reached' });
     }
     existingItem.quantity++;
   } else {
     foundUser.inventory.push({ itemId, type, quantity: 1 });
   }

   foundUser.currency -= price;
   writeDatabase(db);

   res.status(200).json({ 
     message: 'Purchase successful',
     newBalance: foundUser.currency,
     inventory: foundUser.inventory
   });
 } catch (error) {
   res.status(500).json({ message: 'Internal server error' });
 }
}

// Keep existing helper functions
function generateAccessToken(user) {
 return sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

export async function getUsers(req, res) {
 try {
   const db = readDatabase();
   res.status(200).json(db.users);
 } catch (error) {
   console.error('Error fetching users:', error);
   res.status(500).json({ message: 'Internal server error' });
 }
}

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

// Function to get details of a single user
export async function getUserDetails(req, res) {
  try {
    const { identifier } = req.params; // Extract identifier (id, username, or email) from URL params

    if (!identifier) {
      return res.status(400).json({ message: "Identifier (id, username, or email) is required." });
    }

    const db = readDatabase();
    let foundUser;

    // Try to parse identifier as an ID, otherwise match by user or email
    if (!isNaN(identifier)) {
      // Numeric ID
      foundUser = db.users.find((u) => u.id === Number(identifier));
    } else {
      // Match by username or email
      foundUser = db.users.find((u) => u.user === identifier || u.email === identifier);
    }

    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user: foundUser });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const { name, email } = req.body;
    const username = req.params.identifier;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const db = readDatabase();
    const userIndex = db.users.findIndex((u) => u.user === username);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user information
    db.users[userIndex] = {
      ...db.users[userIndex],
      user: name,
      email: email,
    };
    
    writeDatabase(db);
    
    res.status(200).json({  
      user: db.users[userIndex]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateCompletedTasks(req, res) {
  try {
    const { user, task, action } = req.body;
    console.log("Request received:", { user, task, action });

    // Validation
    if (!user || !task || !action) {
      console.error("Validation failed:", { user, task, action });
      return res.status(400).json({ message: "User, task, and action are required." });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);
    if (!foundUser) {
      console.error("User not found:", user);
      return res.status(404).json({ message: "User not found." });
    }

    // Update tasks
    if (action === "complete") {
      if (!foundUser.completedTasks.includes(task)) {
        foundUser.completedTasks.push(task);
      }
    } else if (action === "uncomplete") {
      foundUser.completedTasks = foundUser.completedTasks.filter((t) => t !== task);
    } else {
      console.error("Invalid action:", action);
      return res.status(400).json({ message: "Invalid action." });
    }

    writeDatabase(db);
    console.log("Completed tasks updated successfully for user:", user);

    res.status(200).json({
      completedTasks: foundUser.completedTasks,
    });
  } catch (error) {
    console.error("Error updating completed tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//fucntion to get users on a leaderboard
export async function getLeaderboard(req, res) {
  try {
    const db = readDatabase();
    const leaderboard = db.users.map((user) => ({
      user: user.user,
      completedTasks: user.completedTasks.length,
    }));

    leaderboard.sort((a, b) => b.completedTasks - a.completedTasks);
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//function to update user coins
export async function updateUserCoins(req, res) {
  try {
    const { user } = req.body;

    // Debugging logs
    console.log("Received request:", req.body);

    if (!user) {
      console.error("Validation failed. User is missing:", user);
      return res.status(400).json({ message: "User is required." });
    }

    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Increment coins by 10
    foundUser.currency = (foundUser.currency || 0) + 10;

    writeDatabase(db);

    res.status(200).json({
      message: "Coins updated successfully",
      coins: foundUser.currency,
    });
  } catch (error) {
    console.error("Error updating user coins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//function to get users streakCount
export async function getStreakCount(req, res) {
  try {
    const { user } = req.params;
    const db = readDatabase();
    const foundUser = db.users.find((u) => u.user === user);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ streakCount: foundUser.streakCount });
  } catch (error) {
    console.error("Error fetching streak count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}