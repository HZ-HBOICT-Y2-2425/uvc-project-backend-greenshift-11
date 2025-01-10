import {JSONFile} from 'lowdb/node';
import {Low} from 'lowdb';

// Initialize the adapter and database
const adapter = new JSONFile('db.json');
const db = new Low(adapter,{});


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

}

// Create a new room
export async function createRoom(req, res) {
  let id = 1;
  while (rooms.find(room => room.id === id)) {
    id++;
  }
 
  const { name, icon, appliances } = req.body;
  let room = { id, name, icon, appliances };  
  
  rooms.push(room);
  await db.write();
  res.status(201).json({ message: "Room created successfully" });
}

// Delete rooms by ID range
export async function deleteRoomsByIDs(req, res) {
  let id = Number(req.params.id);  
  let index = rooms.findIndex(room => room.id === id);
  if (index===-1) {
    res.status(404).send(`The room with id ${id} doesn't exist`);    
  }
  else {
    rooms.splice(index, 1);
    await db.write();
    res.status(200).send(`Removed room with id ${id}`);
  }    
}

export async function getRoomNames(req, res) {
  const ids = rooms.map(room => room.id);
  const icons = rooms.map(room => room.icon);
  const names = rooms.map(room => room.name);

  res.status(200).json({ ids, icons, names });
}
