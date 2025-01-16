import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs, getNames, getApplianceUsage, getApplianceTypes, getCO2Footprint} from '../controllers/applianceController.js';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoomsByIDs, getRoomNames } from '../controllers/roomController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/appliance', checkName, getAllAppliances);
router.get('/appliance/:id', checkName, getApplianceById);
router.post('/appliance', checkName, createAppliance); 
router.put('/appliance/:id', checkName, updateAppliance);
router.delete('/appliance/:id', checkName, deleteAppliancesByIDs);
router.get('/appliance/api/appliance-usage', checkName, getApplianceUsage);
router.get('/appliance/api/appliance-names', checkName, getNames);
router.get('/appliance/api/appliance-types', getApplianceTypes);
router.get('/appliance/api/co2-footprint', checkName, getCO2Footprint);

router.get('/room', checkName, getAllRooms);
router.get('/room/:id', checkName, getRoomById);
router.post('/room', checkName, createRoom);
router.put('/room/:id', checkName, updateRoom);
router.delete('/room/:id', checkName, deleteRoomsByIDs);
router.get('/api/room-names', checkName, getRoomNames);

export default router;