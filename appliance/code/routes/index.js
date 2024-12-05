import express from 'express';
import { getAllAppliances, getApplianceById, createAppliance, updateAppliance, deleteAppliancesByIDs } from '../controllers/applianceController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import cors from 'cors';
const router = express.Router();

router.get('/', cors(), checkName, getAllAppliances);
router.get('/:id', cors(), checkName, getApplianceById);
router.post('/', cors(), checkName, createAppliance);
router.put('/:id', cors(), checkName, updateAppliance);
router.delete('/:id', cors(), checkName, deleteAppliancesByIDs);

export default router;
