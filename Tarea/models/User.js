// Tarea/models/User.js - CÓDIGO CORREGIDO
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    password: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    // El campo 'achievements' fue eliminado de aquí.
    
    streak: {
      type: DataTypes.INTEGER, 
      defaultValue: 0,
    },
    lastActive: {
      type: DataTypes.DATE, 
      allowNull: true,
    },
  }, {
    timestamps: true, 
  });

  return User;
};