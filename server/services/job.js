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
            TemplateId: templateId,
        });
    },
    getJobByUuid: function(uuid) {
        return job.findOne({
            where: {
                uuid: uuid
            },
            include: [{
                model: models.Template
            }]
        })
    },
    updateJobDataByUuid: function(uuid, data) {
        return job.update({
            data: data
        }, {
            where: {
                uuid: uuid
            }
        })
    }
};