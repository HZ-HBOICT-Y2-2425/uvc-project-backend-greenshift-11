import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs } from '../controllers/applianceController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const dbPath = path.resolve('./db.json');
const readDatabase = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
 };

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
  const db = readDatabase();
  const appliances = db.appliances;

  const series = appliances.map(appliance => appliance.hoursPerWeek);
  const categories = appliances.map(appliance => appliance.brand);
  const labels = appliances.map(appliance => appliance.type);

  res.json({ series: [{ data: series }], categories, labels });
});

export default router;