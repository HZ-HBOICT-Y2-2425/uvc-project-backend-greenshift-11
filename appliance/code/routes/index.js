import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs } from '../controllers/applianceController.js';
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

// New route for appliance usage data
router.get('/api/appliance-usage', (req, res) => {
  const db = require('../db.json');
  const appliances = db.appliances;

  const series = appliances.map(appliance => appliance.hoursPerWeek);
  const categories = appliances.map(appliance => appliance.brand);
  const labels = appliances.map(appliance => appliance.type);

  res.json({ series: [{ data: series }], categories, labels });
});

export default router;