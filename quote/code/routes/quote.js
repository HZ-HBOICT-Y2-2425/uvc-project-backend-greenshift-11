import express from "express";
import { getAllQuotes, getRandomQuote } from "../controllers/quoteController.js";

const router = express.Router();


router.get('/quotes', getAllQuotes);

router.get('/quote/random', getRandomQuote );

export default router;
