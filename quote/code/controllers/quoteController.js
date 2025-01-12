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
  "Turn off the lights, not the planet. Every switch helps reduce CO₂. ~ Unknown",
  "The greatest threat to our planet is the belief that someone else will save it. ~ Robert Swan",
  "There is no Planet B. We must take care of the one we have. ~ Emmanuel Macron",
  "Climate change is no longer some far-off problem; it is happening here, it is happening now. ~ Barack Obama",
  "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share. ~ Lady Bird Johnson",
  "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves. ~ Mahatma Gandhi",
  "The more clearly we can focus our attention on the wonders and realities of the universe about us, the less taste we shall have for destruction. ~ Rachel Carson",
  "Conservation is a state of harmony between men and land. ~ Aldo Leopold",
  "The Earth does not belong to us: we belong to the Earth. ~ Marlee Matlin",
  "Never doubt that a small group of thoughtful, committed citizens can change the world. ~ Margaret Mead",
  "The future will either be green or not at all. ~ Bob Brown",
  "Sustainability is no longer about doing less harm. It's about doing more good. ~ Jochen Zeitz",
  "Every action counts: your carbon footprint is the legacy you leave on Earth. ~ Anonymous",
  "In nature, nothing exists alone. ~ Rachel Carson",
  "The time to protect our planet is not tomorrow, but today. ~ Jane Goodall",
  "Sustainable development is development that meets the needs of the present without compromising the ability of future generations to meet their own needs. ~ Gro Harlem Brundtland",
  "We do not inherit the Earth from our ancestors; we borrow it from our children. ~ Native American Proverb",
  "The question is not whether we can afford to invest in every child; it is whether we can afford not to. ~ Marian Wright Edelman"
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
