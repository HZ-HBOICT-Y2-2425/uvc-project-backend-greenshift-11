import express from "express";
const app = express();
const PORT = 3014;

const quotes = [
    "We cannot solve our problems with the same thinking we used when we created them. ~ Albert Einstein",
    "The Earth is what we all have in common, and it's up to us to protect it. ~ Wendell Berry",
    "A small change in our habits can lead to a big drop in carbon emissions. ~ Unknown",
    "Reducing CO₂ is not just about saving the planet; its about creating a future worth living in. ~ Anonymous",
    "Carbon dioxide doesnt stop at borders—its a global issue that needs global solutions. ~ Unknown",
    "The best way to predict the future is to create it—reduce your carbon footprint today. ~ Peter Drucker",
    "Plant trees, not excuses—they eat CO₂ for breakfast! ~ Anonymous",
    "Turn off the lights, not the planet. Every switch helps reduce CO₂. ~ Unknown"
  ];

//fucntion to get all quotes
export const getAllQuotes = (req, res) => {
    res.json(quotes);
};

//function to get random quote
export const getRandomQuote = (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
};
