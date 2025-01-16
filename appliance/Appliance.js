const { DataTypes } = require("sequelize");
const { roles } = require("../../config");
const ApplianceModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  hoursPerWeek: {
    type: DataTypes.FLOAT,
    allowNull: false,
    unique: true,
  }
};

module.exports = {
  initialize: (sequelize) => {
    this.model = sequelize.define("appliance", ApplianceModel);
  },

  createAppliance: (appliance) => {
    return this.model.create(appliance);
  }
};