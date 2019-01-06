'use strict';
module.exports = (sequelize, DataTypes) => {
  const Administrator = sequelize.define('Administrator', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Administrator.associate = function(models) {
    // associations can be defined here
  };
  return Administrator;
};