import express from "express";
import { getArticlesByCategory, getAllCategories} from "../controllers/articleController.js";

const router = express.Router();

// Route to get all categories
router.get("/articles", getAllCategories);

// Route to get articles by category
router.get("/articles/:category", getArticlesByCategory);

export default router;
