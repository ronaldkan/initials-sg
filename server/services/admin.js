const models = require('../models');
const model = models.Administrator;

module.exports = {

    getAdminForAuth: function(body) {
        return model.findAll({
            where: {
                username: body.username,
                password: body.password
            }
        })
    }
};