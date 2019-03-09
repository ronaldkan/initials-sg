const models = require('../models');
const model = models.AddressBookEntry;

module.exports = {
    getAll: function() {
        console.log('test');
        return model.findAll({
            order: [
                ['id', 'DESC']
            ]
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