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
    createJob: function() {
        return job.create({
            recipient: "ronaldxkan@gmail.com",
            data: "{fewfwefwfffw: fewfwefew}",
            subject: "subject 1",
            message: " hello there",
            TemplateId: 1,
        });
    }
};