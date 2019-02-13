const models = require('../models');
const model = models.Administrator;

module.exports = { 

    getAll: function() {
        return model.findAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: ['id', 'username', 'createdAt', 'updatedAt']
        })
    },
    createAdmin: function(body) {
        return model.create({
            username: body.username,
            password: body.password,
        })
    },
    getAdminForAuth: function(email) {
        return model.findOne({
            where: {
                username: body.username
            }
        })
    }
};