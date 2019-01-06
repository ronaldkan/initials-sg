const model = require('../models').Organization;

module.exports = {
    getAll: function() {
        return model.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
    },
    createOrganization: function(body) {
        return model.create({
            name: body.name,
            description: body.description
        })
    },
};