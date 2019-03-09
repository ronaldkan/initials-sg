'use strict';
module.exports = (sequelize, DataTypes) => {
  const AddressBookEntry = sequelize.define('AddressBookEntry', {
    email: DataTypes.STRING,
    phonenumber: DataTypes.INTEGER,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING
  }, {});
  AddressBookEntry.associate = function(models) {
    // associations can be defined here
    AddressBookEntry.belongsTo(models.Organization);
  };
  return AddressBookEntry;
};