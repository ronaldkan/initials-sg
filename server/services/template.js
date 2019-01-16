const models = require('../models');
const template = models.Template;

module.exports = {
    getAll: function () {
        return template.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
    },
    createTemplate: function (file, component, name) {
        return template.create({
            file: file,
            component: component,
            createdBy: name
        });
    },
    updateTemplate: function (id, component) {
        return template.update({
            component: component,
            isDeleted: false
        }, {
                where: {
                    id: id
                }
            });
    },
    getTemplateById: function (id) {
        return template.findOne({
            where: {
                id: id
            }
        })
    }
};