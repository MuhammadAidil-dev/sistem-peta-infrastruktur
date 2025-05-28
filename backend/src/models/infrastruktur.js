const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const Infrastruktur = sequelize.define('Infrastruktur', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  infrastrukturName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  infrastrukturType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  infrastrukturStatus: {
    type: DataTypes.ENUM('baik', 'rusak', 'dalam perbaikan'),
    defaultValue: 'rusak',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Infrastruktur;
