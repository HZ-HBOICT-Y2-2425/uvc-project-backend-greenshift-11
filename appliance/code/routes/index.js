import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs, getApplianceUsage } from '../controllers/applianceController.js';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoomsByIDs, getRoomNames } from '../controllers/roomController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const router = express.Router();

const dbPath = path.resolve('./db.json');
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
 };

router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/appliance', cors(), checkName, getAllAppliances);
router.get('/appliance/:id', cors(), checkName, getApplianceById);
router.post('/appliance', cors(), checkName, createAppliance);
router.put('/appliance/:id', cors(), checkName, updateAppliance);
router.delete('/appliance/:id', cors(), checkName, deleteAppliancesByIDs);
router.get('/api/appliance-usage', cors(), checkName, getApplianceUsage);

router.get('/room', cors(), checkName, getAllRooms);
router.get('/room/:id', cors(), checkName, getRoomById);
router.post('/room', cors(), checkName, createRoom);
router.put('/room/:id', cors(), checkName, updateRoom);
router.delete('/room/:id', cors(), checkName, deleteRoomsByIDs);
router.get('/api/room-names', cors(), checkName, getRoomNames);

export default router;