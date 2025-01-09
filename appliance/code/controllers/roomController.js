import { Low, JSONFile } from 'lowdb';

const file = new JSONFile('db.json');
const db = new Low(file);
await db.read(); 

if (!db.data) {
  db.data = { meta: { "tile": "List of rooms", "date": "December 2024" }, rooms: [] };
  await db.write();
}

const rooms = db.data.rooms;

export async function getAllRooms(req, res) {
  const roomUrls = rooms.map(room => `/co2/${room.id}`);
  res.status(200).json(roomUrls); // Use JSON for consistency
}

// Update a room by ID
export async function updateRoom(req, res) {
  let id = Number(req.params.id);
  let roomIndex = rooms.findIndex(room => room.id === id);
  
  if (roomIndex !== -1) {
    let name = req.query.name;
    let icon = req.query.icon;
    let appliances = req.query.appliances; // Adjust parsing if needed
    
    rooms[roomIndex] = { id, name, icon, appliances };  
    await db.write();
    res.status(200).send(`Updated room: ${JSON.stringify(rooms[roomIndex])}`);
  } else {
    res.status(404).send(`The room with id ${id} doesn't exist`);
  }
}

export async function getRoomById(req, res) {
  const room = rooms.find(a => a.id === parseInt(req.params.id));
  
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ message: 'Room not found' });
  }

  res.status(200).json(room);
}

// Create a new room
export async function createRoom(req, res) {
  let id = 1;
  while (rooms.find(room => room.id === id)) {
    id++;
  }
  let name = req.query.name;
  let icon = req.query.icon;
  let appliances = req.query.appliances;
  let room = { id, name, icon, appliances };  
  
  rooms.push(room);
  await db.write();
  res.status(201).json({ message: "Room created successfully" });
}

// Delete rooms by ID range
export async function deleteRoomsByIDs(req, res) {
  let startID = Number(req.params.start);
  let endID = Number(req.params.end);
  
  if (startID > endID) {
    return res.status(400).send("The end id must be greater than or equal to start id");
  }

  let initialLength = rooms.length; // Store the initial length to avoid deleting in an iteration issue
  rooms = rooms.filter(room => room.id < startID || room.id > endID);
  
  if (rooms.length < initialLength) {
    await db.write();
    res.status(200).send(`Removed rooms with IDs from ${startID} to ${endID}`);
  } else {
    res.status(404).send("No rooms were deleted, please check the IDs");
  }
}

export async function getRoomNames(req, res) {
  const ids = rooms.map(room => room.id);
  const icons = rooms.map(room => room.icon);
  const names = rooms.map(room => room.name);

  res.status(200).json({ ids, icons, names });
}
