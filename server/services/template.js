const models = require('../models');
const template = models.Template;

module.exports = {
    getAll: function() {
        return template.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
    },
    createTemplate: function(file, component) {
        template.findOne({
            where: {
                file: file
            }
        }).then(function (data) {
            if (data === null) {
                return template.create({
                    file: file,
                    component: component
                });
            } else {
                return template.update({
                    component: component
                }, {
                    where: {
                        file: file
                    }
                });
            }
        });
    },
    updateTemplate: function(file, component) {
        return template.update({
            component: component,
            isDeleted: false
        }, {
            where: {
                file: file
            }
        });
    },
    getTemplateByFileName: function(file) {
        return template.findOne({
            where: {
                file: file
            }
        });
    },
};