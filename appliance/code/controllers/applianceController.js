import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "List of appliances","date": "December 2024"}, appliances : [] }
const db = await JSONFilePreset('db.json', defaultData)
const appliances = db.data.appliances

export async function getAllAppliances(req, res) {
  const applianceUrls = appliances.map(appliance => `/co2/${appliance.id}`);
  res.status(200).send(applianceUrls);
}

export async function updateAppliance(req, res) {
  let id = Number(req.params.id);
  let appliance = appliances.find(appliance => appliance.id === id);
  if (appliance) {
    let id = req.query.id;
    let brand = req.query.brand;
    let type = req.query.type;
    let description = req.query.description;
    let hoursPerWeek = req.query.hoursPerWeek;
    let appliance = {id: id, brand: brand, type: type, description: description, hoursPerWeek: hoursPerWeek};  
    // todo remove log
    console.log(appliance);
    appliances.push(appliance);
    await db.write();
    res.status(201).send(`I updated this appliance: ${JSON.stringify(appliance)}?`);
  }
  else{
    res.status(404).send(`The appliance with id ${JSON.stringify(appliance)}? doesnt exist`);
  }
}

export async function getApplianceById(req, res) {
  let id = Number(req.params.id);
  let appliance = appliances.find(appliance => appliance.id === id);
  if (appliance) {
    res.status(200).send(appliance);
  } else {
    res.status(404).send('Appliance not found');
  }
}

export async function createAppliance(req, res) {
  let id = Number(req.params.id);
  let appliance = appliances.find(appliance => appliance.id === id);
  if (appliance) {
    res.status(404).send("This id is already occupied");
  } else {
    let brand = req.query.brand;
    let type = req.query.type;
    let description = req.query.description;
    let hoursPerWeek = req.query.hoursPerWeek;
    let appliance = {id: id, brand: brand, type: type, description: description, hoursPerWeek: hoursPerWeek};  
    // todo remove log
    console.log(appliance);
    appliances.push(appliance);
    await db.write();

    res.status(201).send(`I added this appliance: ${JSON.stringify(appliance)}?`);
  }
}

export async function deleteAppliancesByIDs(req, res) {
  let startID = Number(req.params.start);
  let endID = Number(req.params.end);
  if(startID > endID){
    res.status(404).send("the end id is smaller or the same as start id");
  }
  else{
    let indexes = [];
    for(let id = startID; id <= endID; id++){
      if(appliances.find(appliance => appliance.id ===id)){
        let i = appliances.indexOf(appliances.find(appliance => appliance.id ===id));
        indexes.push(i);
      }
      else{
        console.log(`There is no appliance with id: ${id}`);
      }
    }
    indexes.forEach(index => appliances.splice(index)); 
    let IDsLeft = [];
    appliances.forEach(appliance => {IDsLeft.push(appliance.id)});
    await db.write();
    res.status(200).send(`${IDsLeft}`);
  }
}