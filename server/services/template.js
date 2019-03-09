const models = require('../models');
const template = models.Template;

module.exports = {
    getAll: function (id) {
        return template.findAll({
            where: {
                UserId: id
            },
            order: [
                ['id', 'DESC']
            ]
        })
    },
    createTemplate: function (file, component, name, userId) {
        return template.create({
            file: file,
            component: component,
            createdBy: name,
            UserId: userId
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
    },
    deleteTemplateById: function (id) {
        return template.destroy({
            where: {
                id: id
            }
        })
    }
};