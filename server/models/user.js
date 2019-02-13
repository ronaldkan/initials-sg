'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.Organization);
  };
  return User;
};