var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
const multer = require('multer');
const HummusRecipe = require('hummus-recipe');
var imageDataURI = require('image-data-uri');
var jsonwebtoken = require('jsonwebtoken');
var Cryptr = require('cryptr');
var zip = require('express-zip');
const smtpUtil = require('../utils/smtp');
var template = require('../services/template');
var job = require('../services/job');
var organization = require('../services/organization');
var user = require('../services/user');
var rimraf = require('rimraf');
var QRCode = require('qrcode');
var md5File = require('md5-file');
var securePin = require("secure-pin");
var secret = '%ivlkCTaW;<Fk@L#cBVK:!yHbZ/y)3';
var mirrorSecret = "FCOOeyckl0eVHLQsLN0qvtAJACmIPIXd";
var cryptr = new Cryptr('nk<%4]<`(6Q@X3A(0gBS5&l[X3dIE.');
const accountSid = 'AC6f83c82769898deb5ca92f1ab7e0ab25';
const authToken = '08ac8dbba600fd0d4ea20ebc69569ac1';
const client = require('twilio')(accountSid, authToken);

const url = process.env.FRONTEND || "http://localhost:3000";

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../pdf'),
    filename(req, file, cb) {
        var newFile = path.join(__dirname, '../pdf/' + `${file.originalname}`);
        if (fs.existsSync(newFile)) {
            cb(null, `${file.originalname}`);
        }
        else {
            cb(null, `${file.originalname}`);
            template.createTemplate(file.originalname, "[]", req.query.name);
        }
    },
});

const upload = multer({ storage });

/*
    Template
*/

router.post('/api/upload', upload.single('file'), (req, res) => {
    res.send({ result: 'success' });
});


router.get('/api/documents', (req, res) => {
    template.getAll().then(data => {
        res.json(data);
    });
});

router.get('/api/file', (req, res) => {
    var fileName = req.query.fileName;
    var filePath = path.join(__dirname, '../pdf/' + fileName);
    res.sendFile(filePath);
});

router.get('/api/template', (req, res) => {
    template.getTemplateByFileName(req.query.fileName).then(function (data) {
        res.json(data);
    });
});

router.post('/api/save', (req, res) => {
    template.updateTemplate(req.body.filename, req.body.components).then(function (data) {
        res.send({ result: 'success' });
    });
});

/* 
    JOB
*/

router.post('/api/pin', (req, res) => {
    var info = req.body;
    job.getJobByUuid(info.uuid, false).then(data => {
        if (data.pin.toString() === info.pin) {
            res.send({ result: 1 });
        } else {
            res.send({ result: 0 });
        }
    });
});

router.get('/api/send', (req, res) => {
    var info = req.query;
    if (info.phone) {
        info.phone = "+65" + info.phone;
    }
    job.createJob(info.to, info.subject, info.message, info.TemplateId, info.data, info.phone).then(function (data) {
        info["url"] = url + "/demo/sign/" + data.uuid;
        QRCode.toDataURL(info["url"], function (err, url1) {
            info["qrcode"] = url1;
            smtpUtil.sendEmail(info);
            res.send({ result: 'success' });
        })
    });
});



var generateFile = function (data, res, confirmation, receipient) {
    var resp = JSON.parse(data.data);
    var filename = data.Template.file;
    var uuid = data.uuid;
    const myPath = path.join(__dirname, '../pdf/generated/' + uuid);
    rimraf(myPath, function () {
        const filePath = path.join(__dirname, '../pdf/' + filename);
        fs.mkdirSync(myPath);
        const pdfDoc = new HummusRecipe(filePath, myPath + "/attachment.pdf");
        pdfDoc.editPage(1);

        var imagesInfo = [];
        var imageArr = [];
        for (var i = 0; i < resp.length; i++) {
            var current = resp[i];
            var left = parseFloat(current['left'].replace("%", ""));
            var top = parseFloat(current['top'].replace("%", ""));
            if (current.hasOwnProperty('src')) {
                var imageWidth = parseFloat(current['width'].replace("%", ""));
                var height = pdfDoc.default.pageHeght * top / 100;
                var width = pdfDoc.default.pageWidth * left / 100;
                var imageWidth = pdfDoc.default.pageWidth * imageWidth / 100;
                let imagePath = path.join(__dirname, '../pdf/images/' + uuid + "-" + i);
                var imageInfo = {
                    width: width,
                    height: height,
                    path: imagePath,
                    src: current['src'],
                    imageWidth: imageWidth
                }
                imagesInfo.push(imageInfo);
                imageArr.push(imageDataURI.outputFile(current['src'], imagePath));

            } else {
                var value = current['value'];
                var height = pdfDoc.default.pageHeght * top / 100;
                var width = pdfDoc.default.pageWidth * left / 100;
                pdfDoc.text(value, width, height, {
                    fontSize: 12,
                    color: '#000000'
                });
            }
        }

        Promise.all(imageArr).then(resp => {
            console.log("images info");
            console.log(resp);
            for (var i = 0; i < resp.length; i++) {
                pdfDoc.image(resp[i], imagesInfo[i].width, imagesInfo[i].height, {
                    width: imagesInfo[i].imageWidth, keepAspectRatio: true
                });
            }
            pdfDoc.endPage();
            pdfDoc.endPDF();
            if (confirmation === true) {
                var confirmationFilePath = myPath + "/attachment.pdf";
                smtpUtil.sendConfirmation(receipient, confirmationFilePath);
                md5File(confirmationFilePath, (err, hash) => {
                    job.updateJobCompletedHashByUuid(data.uuid, hash);
                });
            } else {
                // TODO add for more than one files
                res.zip([
                    { path: myPath + "/attachment.pdf", name: filename }
                ], "Download.zip");
            }
        });
    })
}

router.get('/api/job/download/:uuid', (req, res) => {
    job.getJobByUuid(req.params.uuid, true).then(data => {
        generateFile(data, res);
        // res.send(data);
    });
});

router.put('/api/job/cancel/:uuid', (req, res) => {
    job.cancelJobDataByUuid(req.params.uuid).then(data => {
        res.send(data);
    });
})

router.put('/api/job', (req, res) => {
    // TODO: refactor to a single statement, due to time leave it for now.
    job.updateJobDataByUuid(req.body.uuid, req.body.data).then(data => {
        job.getJobByUuid(req.body.uuid, true).then(data1 => {
            generateFile(data1, res, true, req.body.recipient);
            res.send(data);
        });
    });
});

router.get('/api/job', (req, res) => {
    job.createJob().then(data => {
        res.json(data);
    });
});

router.get('/api/job/all', (req, res) => {
    job.getAll().then(data => {
        res.json(data);
    });
});

router.get('/api/job/:uuid', (req, res) => {
    job.getJobByUuid(req.params.uuid, true).then(data => {
        res.json(data);
    });
});

router.get('/api/sign/:uuid', (req, res) => {
    var uuid = req.params.uuid;
    job.getJobByUuid(uuid, false).then(data => {
        if (data.phone && !data.pin) {
            securePin.generatePin(6, (pin) => {
                job.updateJobPinByUuid(uuid, pin.toString()).then(resp => {
                    client.messages
                        .create({ from: 'InitialsSG', body: 'Your Initials One-Time PIN is ' + pin + ". It will expire in 2 minutes.", to: data.phone})
                        .then(message => console.log(message.sid))
                        .done();
                });
            })
        }
        res.json(data);
    });
});

/*
    Organization
*/

router.post('/api/organization', (req, res) => {
    organization.createOrganization(req.body).then(org => {
        res.json(org);
    });
});

router.get('/api/organization', (req, res) => {
    organization.getAll().then(orgs => {
        res.json(orgs);
    })
});

router.get('/api/user', (req, res) => {
    user.getAll().then(users => {
        res.json(users);
    });
});

router.post('/api/user', (req, res) => {
    user.createUser(req.body).then(user => {
        res.json(user);
    })
});

router.post('/api/login', (req, res) => {
    user.getUserForAuth(req.body).then(user => {
        if (user.length === 0) {
            res.status(404).json({ 'result': 'User unknown' });
        }
        var token = jsonwebtoken.sign({
            userId: user,
            secret: mirrorSecret
        }, secret, {
            expiresIn: 60
        })
        res.json({ token: cryptr.encrypt(token) });
    })
})

module.exports = router;
