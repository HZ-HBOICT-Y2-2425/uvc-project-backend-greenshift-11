import express from "express";
const app = express();
const PORT = 3013;

// Store original category information to know which tasks can be refreshed
const originalTasks = {
  large_appliances: [
    "Monitor fridge temperature and ensure it is between 3°C and 5°C to save energy.",
    "Defrost your freezer if ice build-up is more than 1/4 inch thick to improve efficiency.",
    "Clean the fridge coils every 6 months to maintain energy efficiency.",
    "Keep AC filters clean by washing or replacing them monthly.",
    "Set your AC thermostat to 26°C when home and 29°C when away.",
    "Use ceiling fans instead of AC for cooling in mild weather.",
    "Turn off the AC when not at home.",
    "Wash clothes in cold water instead of hot water to save on energy costs.",
    "Use the washing machine only with full loads to reduce energy use.",
    "Dry clothes outside on a clothesline instead of using the dryer.",
    "Unplug the washing machine and dryer when not in use.",
    "Remember to avoid leaving the fridge open too long."
  ],
  multiple_devices: [
    "Unplug phone chargers when not in use.",
    "Set devices to low power mode to extend battery life.",
    "Use power strips to switch off multiple devices at once.",
    "Avoid overcharging devices like phones and laptops.",
    "Turn off your TV and monitor when not in use.",
    "Schedule a daily unplugging routine for all electronic devices.",
    "Use energy-efficient monitors (LED or LCD).",
    "Adjust your screen brightness to a lower level.",
    "Enable sleep mode on computers and laptops after 5 minutes of inactivity.",
    "Monitor energy usage using apps like smart energy monitors.",
    "Replace old chargers with energy-efficient or certified ones.",
    "Switch off devices when leaving the room for more than 15 minutes.",
    "Don't leave your phones plugged in when fully charged."
  ],
  general_users: [
    "Switch to energy-efficient light bulbs (LED).",
    "Turn off lights and fans when leaving the room.",
    "Use natural daylight for indoor lighting during the day.",
    "Avoid boiling excess water when using an electric kettle.",
    "Reduce microwave usage; use a stove for quick heating.",
    "Run small appliances (like toasters) only when needed.",
    "Encourage a power-off habit for all appliances before bedtime.",
    "Schedule a 'no appliance hour' every evening to reduce overall energy consumption.",
    "Reduce unnecessary use of fans and encourage natural ventilation.",
    "Avoid leaving fans or heaters running in empty rooms.",
    "Cook with lids on pots to reduce cooking time and energy.",
    "Remember to not leave your devices plugged in."
  ]
};

// Create consolidated tasks array with metadata
const allTasks = [
  ...originalTasks.general_users.map(task => ({
    text: task,
    isRefreshable: false,
    category: 'general_users',
    funFact: task.includes("energy-efficient") 
      ? "Fun Fact: LED bulbs use about 75% less energy than incandescent bulbs!" 
      : null,
  })),
  ...originalTasks.large_appliances.map(task => ({
    text: task,
    isRefreshable: true,
    category: 'large_appliances',
    funFact: task.includes("fridge") 
      ? "Fun Fact: Keeping your fridge at 3°C to 5°C can save up to 15% energy!" 
      : null,
  })),
  ...originalTasks.multiple_devices.map(task => ({
    text: task,
    isRefreshable: true,
    category: 'multiple_devices',
    funFact: task.includes("phone chargers") 
      ? "Fun Fact: Unplugging chargers can save up to $100 per year in energy costs!" 
      : null,
  }))
];

// Get all tasks with refresh information
export const getAllTasks = (req, res) => {
  res.status(200).json({ tasks: allTasks });
};

// Get alternative task of same category
export const getAlternativeTask = (req, res) => {
  const { category } = req.params;
  const { currentTask } = req.query;
  
  const categoryTasks = allTasks.filter(task => 
    task.category === category && 
    task.text !== currentTask
  );
  
  if (categoryTasks.length === 0) {
    return res.status(404).json({ error: "No alternative tasks available" });
  }
  
  const randomTask = categoryTasks[Math.floor(Math.random() * categoryTasks.length)];
  res.status(200).json({ task: randomTask });
};
