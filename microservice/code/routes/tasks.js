import express from "express";
import { getTasksByCategory, getAllCategories } from "../controllers/taskController.js";

const router = express.Router();

// Route to get all categories
router.get("/tasks", getAllCategories);

// Route to get tasks by category
router.get("/tasks/:category", getTasksByCategory);

export default router;
