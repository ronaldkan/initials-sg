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
    createEntry: function(body) {
        return model.create({
            email: body.email,
            phonenumber: body.phonenumber,
            firstname: body.firstname,
            lastname: body.lastname,
            OrganizationId: body.organizationId
        })
    },

   
};