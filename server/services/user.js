const models = require('../models');
const model = models.User;

module.exports = {
    getAll: function() {
        return model.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{
                model: models.Organization
            }]
        })
    },
    createUser: function(body) {
        return model.create({
            email: body.email,
            password: body.password,
            firstname: body.firstname,
            lastname: body.lastname,
            OrganizationId: body.organizationId
        })
    },
    getUserForAuth: function(body) {
        return model.findAll({
            where: {
                email: body.email,
                password: body.password
            }
        })
    }

   
};