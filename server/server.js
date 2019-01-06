const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const url = process.env.FRONTEND || "http://localhost:3000";
var jwt = require('express-jwt');
var secret = '%ivlkCTaW;<Fk@L#cBVK:!yHbZ/y)3';
const index = require('./routes/index');
const models = require('./models');

models.Template.sync().then(data => {
    models.Job.sync().then(data => {
        console.log("Job synced");
    });
});

models.Organization.sync().then(data => {
    models.User.sync().then(data => {
        console.log("User synced");
    });
});

models.Administrator.sync().then(data => {
    console.log("Administrator synced");
});

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', url);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use(jwt({secret: secret}).unless({ path: ['/api/login', '/api/organization', '/api/user'] }));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.redirect('/');
    }
});

app.get('*', function(req, res) {
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
