import { JSONFilePreset } from "lowdb/node";

// Initialize the database with default data if it doesn't exist
const defaultData = { meta: { title: "List of rooms", date: "December 2024" }, rooms: [] };
const db = await JSONFilePreset('./db.json', defaultData);
const rooms = db.data.rooms;
// Get all rooms (URLs)
export async function getAllRooms(req, res) {
  const roomUrls = rooms.map(room => `/co2/${room.id}`);
  res.status(200).json(roomUrls); // Use JSON for consistency
}

// Update a room by ID
export async function updateRoom(req, res) {
  const id = Number(req.params.id);
  const roomIndex = rooms.findIndex(room => room.id === id);

  if (roomIndex === -1) {
    return res.status(404).json({ message: `The room with id ${id} doesn't exist` });
  }

  const { name, icon, appliances } = req.body; // Use req.body to get data
  if (!name || !icon || !appliances) {
    return res.status(400).json({ message: "Missing required fields: name, icon, or appliances" });
  }

  rooms[roomIndex] = { id, name, icon, appliances };
  await db.write(); // Save changes to the database

  res.status(200).json({ message: "Room updated successfully", room: rooms[roomIndex] });
}

// Get a single room by ID
export async function getRoomById(req, res) {
  const id = Number(req.params.id);
  const room = rooms.find(r => r.id === id);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  res.status(200).json(room);
}

// Create a new room
export async function createRoom(req, res) {
  try {
    let id = 1;
    while (rooms.some((room) => room.id === id)) {
      id++;
    }

    const { name, icon, appliances } = req.body;

    if (!name || !icon || !Array.isArray(appliances)) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name, icon, or appliances" });
    }

    const newRoom = { id, name, icon, appliances };
    rooms.push(newRoom);
    await db.write();

    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
}

// Delete rooms by ID range
export async function deleteRoomsByIDs(req, res) {
  const startID = Number(req.params.start);
  const endID = Number(req.params.end);

  if (startID > endID) {
    return res.status(400).json({ message: "The start ID must be less than or equal to the end ID" });
  }

  const idsToDelete = [];
  for (let id = startID; id <= endID; id++) {
    const roomIndex = rooms.findIndex(room => room.id === id);
    if (roomIndex !== -1) {
      rooms.splice(roomIndex, 1);
      idsToDelete.push(id);
    }
  }

  await db.write();
  res.status(200).json({ message: "Rooms deleted successfully", deletedIds: idsToDelete });
}

// Get all room names, icons, and IDs
export async function getRoomNames(req, res) {
  const ids = rooms.map(room => room.id);
  const icons = rooms.map(room => room.icon);
  const names = rooms.map(room => room.name);

  res.status(200).json({ ids, icons, names });
}
