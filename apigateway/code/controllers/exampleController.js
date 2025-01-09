import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

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