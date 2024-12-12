import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs } from '../controllers/applianceController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

//routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/appliance', checkName, getAllAppliances);
router.get('/appliance/:id', checkName, getApplianceById);
router.post('/appliance', checkName, createAppliance);
router.put('/appliance/:id', checkName, updateAppliance);
router.delete('/appliance/:id', checkName, deleteAppliancesByIDs);

export default router;