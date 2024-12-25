import express from "express";
const app = express();
const PORT = 3011;

const tasks = {
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
  
  export const getTasksByCategory = (req, res) => {
    const { category } = req.params;
    if (tasks[category]) {
      res.status(200).json({ tasks: tasks[category] });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  };
  
  export const getAllCategories = (req, res) => {
    res.status(200).json({ categories: Object.keys(tasks) });
  };
  
  export const updateTasksByCategory = (req, res) => {
    const { category } = req.params; // Category from URL params
    const { tasks: newTasks } = req.body; // Tasks array from request body
  
    console.log("Updating tasks for category:", category);
    console.log("New tasks:", newTasks);
  
    // Validate input
    if (!category || !newTasks || !Array.isArray(newTasks)) {
      return res
        .status(400)
        .json({ message: "Category and tasks array are required." });
    }
  
    // Check if the category exists
    if (!tasks[category]) {
      return res.status(404).json({ message: "Category not found." });
    }
  
    // Append the new tasks to the existing tasks
    tasks[category] = [...tasks[category], ...newTasks];
  
    console.log(`Tasks for category "${category}" updated successfully.`);
    res.status(200).json({
      message: `Tasks updated for category: ${category}`,
      tasks: tasks[category],
    });
  };