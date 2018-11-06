'use strict';
module.exports = (sequelize, DataTypes) => {
  const Template = sequelize.define('Template', {
    file: DataTypes.STRING,
    component: DataTypes.JSONB
  }, {
    paranoid: true
  });
  Template.associate = function(models) {

    // associations can be defined here
  };
  return Template;
};