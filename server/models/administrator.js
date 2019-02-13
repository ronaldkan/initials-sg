'use strict';
module.exports = (sequelize, DataTypes) => {
  const Administrator = sequelize.define('Administrator', {
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING
  }, {});
  Administrator.associate = function (models) {
    // associations can be defined here
  };
  return Administrator;
};