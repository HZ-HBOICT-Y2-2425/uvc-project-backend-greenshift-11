import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs } from '../controllers/applianceController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import cors from 'cors';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});

router.get('/co2', cors(), checkName, getAllAppliances);
router.get('/co2/:id', cors(), checkName, getApplianceById);
router.post('/co2', cors(), checkName, createAppliance);
router.put('/co2/:id', cors(), checkName, updateAppliance);
router.delete('/co2/:id', cors(), checkName, deleteAppliancesByIDs);

export default router;
