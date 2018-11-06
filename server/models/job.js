'use strict';
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    recipient: DataTypes.STRING,
    data: DataTypes.JSONB,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    uuid: { 
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    paranoid: true
  });
  Job.associate = function(models) {
    // associations can be defined here
    Job.belongsTo(models.Template);
  };
  return Job;
};