const models = require('../models');
const job = models.Job;

module.exports = {
    getAll: function() {
        return job.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{
                model: models.Template
            }]
        })
    },
    createJob: function(to, subject, message, templateId, data, phone) {
        return job.create({
            recipient: to,
            data: data,
            subject: subject,
            message: message,
            iscompleted: false,
            iscancelled: false,
            TemplateId: templateId,
            phone: phone
        });
    },
    getJobByUuid: function(uuid, completed) {
        return job.findOne({
            where: {
                uuid: uuid,
                iscompleted: completed,
                iscancelled: false
            },
            include: [{
                model: models.Template
            }]
        })
    },
    updateJobDataByUuid: function(uuid, data) {
        return job.update({
            data: data,
            iscompleted: true
        }, {
            where: {
                uuid: uuid
            }
        })
    },
    cancelJobDataByUuid: function(uuid) {
        return job.update({
            iscancelled: true
        }, {
            where: {
                uuid: uuid
            }
        })
    },
    updateJobCompletedHashByUuid: function(uuid, hash) {
        return job.update({
            completedhash: hash
        }, {
            where: {
                uuid: uuid
            }
        })
    },
    updateJobPinByUuid: function(uuid, pin) {
        return job.update({
            pin: pin
        }, {
            where: {
                uuid: uuid
            }
        })
    },
};