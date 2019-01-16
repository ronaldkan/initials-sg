'use strict';
module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define('Template', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    file: DataTypes.STRING,
    component: DataTypes.JSONB,
    createdBy: DataTypes.STRING
  }, {
      paranoid: true
    });
  Template.associate = function (models) {

    // associations can be defined here
  };
  return Template;
};