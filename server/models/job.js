'use strict';
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    recipient: DataTypes.STRING,
    data: DataTypes.JSONB,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    iscompleted: DataTypes.BOOLEAN,
    iscancelled: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    pin: DataTypes.INTEGER,
    uuid: { 
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    completedhash: DataTypes.STRING
  }, {
    paranoid: true
  });
  Job.associate = function(models) {
    // associations can be defined here
    Job.belongsTo(models.Template);
  };
  return Job;
};