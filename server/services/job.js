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
    createJob: function(to, subject, message, templateId, data) {
        return job.create({
            recipient: to,
            data: data,
            subject: subject,
            message: message,
            iscompleted: false,
            TemplateId: templateId,
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
    }
};