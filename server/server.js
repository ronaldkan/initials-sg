const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5000;
const url = process.env.FRONTEND || "http://localhost:3000";
const index = require('./routes/index');
const models = require('./models');
var organization = require('./services/organization');
var user = require('./services/user');

models.Template.sync().then(data => {
    models.Job.sync().then(data => {
        console.log("Job synced");
    });
});

models.Organization.sync().then(data => {
    models.User.sync().then(data => {
        organization.getAll().then(orgs => {
            if (orgs.length === 0) {
                organization.createOrganization({
                    'name': 'GovTech',
                    'description': 'GovTech Test'
                }).then(org => {
                    user.createUser({
                        email: 'admin',
                        password: '123',
                        firstname: 'admin',
                        lastname: 'account',
                        OrganizationId: org.id
                    });
                });
            }
        })
        console.log("User synced");
    });
});

models.Administrator.sync().then(data => {

    console.log("Administrator synced");
});

app.use(cors({credentials: true, origin: ['http://localhost:3000'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', index);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.redirect('/');
    }
});

app.get('*', function (req, res) {
    res.redirect('/');
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
