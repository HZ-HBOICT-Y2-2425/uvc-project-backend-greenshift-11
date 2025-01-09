import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of rooms","date": "December 2024"}, rooms : [] }
const db = await JSONFilePreset('db.json', defaultData)
const rooms = db.data.rooms

export async function getAllRooms(req, res) {
  const roomUrls = rooms.map(room => `/co2/${room.id}`);
  res.status(200).send(roomUrls);
}

export async function updateRoom(req, res) {
  let id = Number(req.params.id);
  let room = rooms.find(room => room.id === id);
  if (room) {
    let name = req.query.name;
    let icon = req.query.icon;
    let appliances = req.query.appliances;
    room = { id: id, name: name, icon: icon, appliances: appliances };  
    // todo remove log
    console.log(room);
    rooms.push(room);
    await db.write();
    res.status(201).send(`I updated this room: ${JSON.stringify(room)}?`);
  } else {
    res.status(404).send(`The room with id ${id} doesn't exist`);
  }
}

export async function getRoomById(req, res) {
  const db = readDatabase();
  console.log('Database contents:', db.rooms); // Log all rooms
  const room = db.rooms.find(a => a.id === parseInt(req.params.id));
  console.log(`Looking for room with id: ${req.params.id}, found:`, room);

  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
}

export async function createRoom(req, res) {
  let id = 1;
  while (rooms.find(room => room.id === id)) {
    id++;
  }
  let name = req.query.name;
  let icon = req.query.icon;
  let appliances = req.query.appliances;
  let room = { id: id, name: name, icon: icon, appliances: appliances };  
  // todo remove log
  console.log(room);
  rooms.push(room);
  await db.write();
  res.status(201).json({ message: "Room created successfully" });
}

export async function deleteRoomsByIDs(req, res) {
  let startID = Number(req.params.start);
  let endID = Number(req.params.end);
  if (startID > endID) {
    res.status(404).send("The end id is smaller or the same as start id");
  } else {
    let indexes = [];
    for (let id = startID; id <= endID; id++) {
      if (rooms.find(room => room.id === id)) {
        let i = rooms.indexOf(rooms.find(room => room.id === id));
        indexes.push(i);
      } else {
        console.log(`There is no room with id: ${id}`);
      }
    }
    indexes.forEach(index => rooms.splice(index));
    let IDsLeft = [];
    rooms.forEach(room => { IDsLeft.push(room.id) });
    await db.write();
    res.status(200).send(`${IDsLeft}`);
  }
}

export async function getRoomNames(req, res) {
  const db = readDatabase();
  console.log('Rooms:', db.rooms); // Log rooms
  const rooms = db.rooms;

  const ids = rooms.map(room => room.id);
  const icons = rooms.map(room => room.icon);
  const names = rooms.map(room => room.name);

  res.json({ ids, icons, names });
}