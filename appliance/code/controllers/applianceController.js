import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = {
  meta: { title: "List of appliances", date: "December 2024" },
  appliances: [],
  applianceWattages: []
};
const db = await JSONFilePreset('./db.json', defaultData);
const appliances = db.data.appliances;
const applianceWattages = db.data.applianceWattages;

// Get all appliance URLs
export async function getAllAppliances(req, res) {
  const applianceUrls = appliances.map(appliance => `/co2/${appliance.id}`);
  res.status(200).send(applianceUrls);
}

// Get appliance by ID
export async function getApplianceById(req, res) {
  const appliance = appliances.find(a => a.id === parseInt(req.params.id));
  
  if (appliance) {
    res.status(200).json(appliance);
  } else {
    res.status(404).json({ message: 'Appliance not found' });
  }
}

// Create a new appliance
export async function createAppliance(req, res) {
  try {
    let id = 1;
    while (appliances.find(appliance => appliance.id === id)) {
      id++;
    }

    const { brand, type, wattage, description, hoursPerWeek } = req.body;

    // Validate input data
    if (!brand || !type || !wattage || !hoursPerWeek) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if(!description){
      description = "No description provided";
    }

    // Create new appliance
    const appliance = { id, brand, type, wattage, description, hoursPerWeek };

    appliances.push(appliance);
    await db.write(); // Save to database

    res.status(201).json({ message: "Appliance created successfully", appliance });
  } catch (error) {
    console.error("Error creating appliance:", error);
    res.status(500).json({ message: "Failed to create appliance" });
  }
}

// Update appliance by ID
export async function updateAppliance(req, res) {
  let id = Number(req.params.id);
  let appliance = appliances.find(appliance => appliance.id === id);
  if (appliance) {
    const { brand, type, wattage, description, hoursPerWeek } = req.body;
    appliance.id = id;
    appliance.brand = brand;
    appliance.type = type;
    appliance.wattage = wattage
    appliance.description = description;
    appliance.hoursPerWeek = hoursPerWeek;

    await db.write();
    res.status(201).json(`${JSON.stringify(appliance)}`);
  } else {
    res.status(404).send(`The appliance with id ${id} doesn't exist`);
  }
}

// Delete appliance by ID
export async function deleteAppliancesByIDs(req, res) {
  let id = Number(req.params.id);
  let index = appliances.findIndex(appliance => appliance.id === id);
  if (index === -1) {
    res.status(404).send(`The appliance with id ${id} doesn't exist`);
  } else {
    appliances.splice(index, 1);
    await db.write();
    res.status(200).send(`Removed appliance with id ${id}`);
  }
}

// Get appliance usage (CO₂ emissions)
export async function getApplianceUsage(req, res) {
  const carbonEmissionFactor = 0.41; // kg CO₂ per kWh

  // Calculate CO₂ emissions for each appliance
  const data = appliances.map(appliance => {
    const wattage = appliance.wattage; // Directly retrieve wattage from the appliance
    const weeklyEnergy = (wattage * appliance.hoursPerWeek) / 1000; // Energy in kWh
    const annualEnergy = weeklyEnergy * 52; // Annual energy in kWh
    const carbonEmission = annualEnergy * carbonEmissionFactor; // CO₂ emissions in kg
    return {
      id: appliance.id,
      brand: appliance.brand,
      type: appliance.type,
      carbonEmission: parseFloat(carbonEmission.toFixed(2)), // Rounded to 2 decimal places
    };
  });

  res.status(200).json(data);
}


// Get appliance names for UI
export async function getNames(req, res) {
  const ids = appliances.map(appliance => appliance.id);
  const brands = appliances.map(appliance => appliance.brand);
  const types = appliances.map(appliance => appliance.type);
  const emojis = appliances.map(appliance => appliance.emoji);

  res.json({ ids, brands, types, emojis });
  res.json({ ids, brands, types, emojis });
}

//used purely for the graph
export async function getApplianceUsage(req, res) {
  console.log('Appliances:', appliances); // Log appliances
  const series = appliances.map(appliance => appliance.hoursPerWeek);
  const categories = appliances.map(appliance => appliance.brand);
  const labels = appliances.map(appliance => appliance.type);

  res.json({ series: [{ data: series }], categories, labels });
}
