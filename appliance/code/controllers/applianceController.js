import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of appliances","date": "December 2024"}, appliances : [] }
const db = await JSONFilePreset('./db.json', defaultData)
const appliances = db.data.appliances

export async function getAllAppliances(req, res) {
  const applianceUrls = appliances.map(appliance => `/co2/${appliance.id}`);
  res.status(200).send(applianceUrls);
}

export async function updateAppliance(req, res) {
  let id = Number(req.params.id);
  let appliance = appliances.find(appliance => appliance.id === id);
  if (appliance) {    
    const { brand, type, description,hoursPerWeek } = req.body;
    appliance.id=id;
    appliance.brand=brand;
    appliance.type=type;
    appliance.description=description;
    appliance.hoursPerWeek=hoursPerWeek;
   
    await db.write();
    res.status(201).json(`${JSON.stringify(appliance)}`);
  } else {
    res.status(404).send(`The appliance with id ${id} doesn't exist`);
  }
}

export async function getApplianceById(req, res) {
  console.log('Database contents:', appliances); // Log all appliances
  const appliance = appliances.find(a => a.id === parseInt(req.params.id));
  console.log(`Looking for appliance with id: ${req.params.id}, found:`, appliance);

  if (appliance) {
    res.status(200).json(appliance);
  } else {
    res.status(404).json({ message: 'Appliance not found' });
  }
}

export async function createAppliance(req, res) {
  try {
    let id = 1;
    while (appliances.find(appliance => appliance.id === id)) {
      id++;
    }

    const { brand, type, description, hoursPerWeek } = req.body;

    // Validate input data
    if (!brand || !type || !description || !hoursPerWeek) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new appliance
    const appliance = { id, brand, type, description, hoursPerWeek };
    console.log("Creating appliance:", appliance);

    appliances.push(appliance);
    await db.write(); // Save to database

    res.status(201).json({ message: "Appliance created successfully", appliance });
  } catch (error) {
    console.error("Error creating appliance:", error);
    res.status(500).json({ message: "Failed to create appliance" });
  }
}

export async function deleteAppliancesByIDs(req, res) {
  let id = Number(req.params.id);  
  let index = appliances.findIndex(room => room.id === id);
  if (index===-1) {
    res.status(404).send(`The appliance with id ${id} doesn't exist`);    
  }
  else {
    appliances.splice(index, 1);
    await db.write();
    res.status(200).send(`Removed appliance with id ${id}`);
  }
}

//used only for displaying the names
export async function getNames(req, res) {
  const ids = appliances.map(appliance => appliance.id);
  const brands = appliances.map(appliance => appliance.brand);
  const types = appliances.map(appliance => appliance.type);

  res.json({ ids, brands, types });
}

//used purely for the graph
export async function getApplianceUsage(req, res) {
  console.log('Appliances:', appliances); // Log appliances
  const series = appliances.map(appliance => appliance.hoursPerWeek);
  const categories = appliances.map(appliance => appliance.brand);
  const labels = appliances.map(appliance => appliance.type);

  res.json({ series: [{ data: series }], categories, labels });
}