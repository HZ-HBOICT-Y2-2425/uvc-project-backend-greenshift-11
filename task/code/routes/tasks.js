import express from "express";
import { getAlternativeTask, getAllTasks} from "../controllers/taskController.js";

const router = express.Router();

// Route to get all categories

// Route to get tasks by category
router.get('/tasks', getAllTasks);

router.get('/tasks/alternative/:category', getAlternativeTask );

export default router;
