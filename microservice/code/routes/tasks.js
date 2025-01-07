import express from "express";
import { getTasksByCategory, getAllCategories,  updateTasksByCategory} from "../controllers/taskController.js";

const router = express.Router();

// Route to get all categories
router.get("/tasks", getAllCategories);

// Route to get tasks by category
router.get("/tasks/:category", getTasksByCategory);

router.put("/tasks/:category", updateTasksByCategory);

export default router;
