const models = require('../models');
const model = models.Administrator;

module.exports = {

    getAll: function() {
        return model.findAll({
            order: [
                ['id', 'DESC']
            ]
        })
    },
    createAdmin: function(body) {
        return model.create({
            username: body.username,
            password: body.password,
        })
    },
    getAdminForAuth: function(body) {
        return model.findAll({
            where: {
                username: body.username,
                password: body.password
            }
        })
    }
};