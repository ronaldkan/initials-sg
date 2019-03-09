var express = require('express');
var router = express.Router();

// Libs 
var fs = require('fs');
var path = require('path');
const multer = require('multer');
const HummusRecipe = require('hummus-recipe');
var imageDataURI = require('image-data-uri');
var jsonwebtoken = require('jsonwebtoken');
var Cryptr = require('cryptr');
var zip = require('express-zip');
var bcrypt = require('bcrypt');
const smtpUtil = require('../utils/smtp');

// Services 
var template = require('../services/template');
var job = require('../services/job');
var organization = require('../services/organization');
var addressbookentry = require('../services/addressbookentry');
var user = require('../services/user');
var admin = require('../services/admin');

// Extra Libs
var rimraf = require('rimraf');
var QRCode = require('qrcode');
var md5File = require('md5-file');
var securePin = require("secure-pin");
const { withAuth, withAdminAuth } = require('../authMiddleware');

// Secrets 
const secret = '%ivlkCTaW;<Fk@L#cBVK:!yHbZ/y)3';
var mirrorSecret = "FCOOeyckl0eVHLQsLN0qvtAJACmIPIXd";
var cryptr = new Cryptr('nk<%4]<`(6Q@X3A(0gBS5&l[X3dIE.');
const accountSid = 'AC6f83c82769898deb5ca92f1ab7e0ab25';
const authToken = '08ac8dbba600fd0d4ea20ebc69569ac1';
const client = require('twilio')(accountSid, authToken);

const url = process.env.FRONTEND || "http://localhost:3000";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        template.createTemplate(file.originalname, "[]", req.importedUser.firstname + " " + req.importedUser.lastname, req.importedUser.id).then(template => {
            const filePath = path.join(__dirname, '../pdf/templates/' + template.id);
            fs.mkdirSync(filePath);
            cb(null, filePath);
        })
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

const upload = multer({ storage });

/*
    Template
*/

router.post('/api/upload', [withAuth, upload.single('file')], (req, res) => {
    res.send({ result: 'success' });
});

router.get('/api/documents', withAuth, (req, res) => {
    template.getAll(req.importedUser.id).then(data => {
        res.json(data);
    });
});

router.get('/api/file', withAuth, (req, res) => {
    var id = req.query.id;
    template.getTemplateById(id).then(template => {
        res.sendFile(path.join(__dirname, '../pdf/templates/' + id + "/" + template.file));
    });
});

router.get('/api/template', withAuth, (req, res) => {
    template.getTemplateById(req.query.id).then(function (data) {
        res.json(data);
    });
});

router.post('/api/save', withAuth, (req, res) => {
    template.updateTemplate(req.body.id, req.body.components).then(function (data) {
        res.send({ result: 'success' });
    });
});

router.get('/api/template/delete/:id', withAuth, (req, res) => {
    template.deleteTemplateById(req.params.id).then(data => {
        res.json(data);
    })
});

/* 
    JOB
*/

router.post('/api/pin', withAuth, (req, res) => {
    var info = req.body;
    job.getJobByUuid(info.uuid, false).then(data => {
        if (data.pin.toString() === info.pin) {
            res.send({ result: 1 });
        } else {
            res.send({ result: 0 });
        }
    });
});

router.get('/api/send', withAuth, (req, res) => {
    var info = req.query;
    if (info.phone) {
        info.phone = "+65" + info.phone;
    }
    job.createJob(info.to, info.subject, info.message, info.TemplateId, info.data, info.phone).then(function (data) {
        info["url"] = url + "/platform/sign/" + data.uuid;
        QRCode.toDataURL(info["url"], function (err, url1) {
            info["qrcode"] = url1;
            smtpUtil.sendEmail(info);
            res.send({ result: 'success' });
        })
    });
});



var generateFile = function (data, res, confirmation, receipient) {
    var resp = JSON.parse(cryptr.decrypt(data.data));
    var filename = data.Template.file;
    var uuid = data.uuid;
    const myPath = path.join(__dirname, '../pdf/generated/' + uuid);
    rimraf(myPath, function () {
        const filePath = path.join(__dirname, '../pdf/templates/' + data.Template.id + '/' + filename);
        fs.mkdirSync(myPath);
        const pdfDoc = new HummusRecipe(filePath, myPath + "/attachment.pdf");
        var numPages = pdfDoc.metadata.pages;
        var pageHeight = pdfDoc.default.pageHeght;
        var pageWidth = pdfDoc.default.pageWidth;
        if (numPages > 0) {
            var theDoc = pdfDoc.metadata['1'];
            pageHeight = theDoc['height'];
            pageWidth = theDoc['width'];
        }
        var imagesInfo = [];
        var imageArr = [];
        for (var x = 0; x < numPages; x++) {
            pdfDoc.editPage(x + 1);

            for (var i = 0; i < resp.length; i++) {
                var current = resp[i];
                if (parseInt(current['pageNumber']) === x + 1) {
                    var left = parseFloat(current['left'].replace("%", ""));
                    var top = parseFloat(current['top'].replace("%", ""));
                    if (current.hasOwnProperty('src')) {
                        var imageWidth = parseFloat(current['width'].replace("%", ""));
                        var height = pageHeight * top / 100;
                        var width = pageWidth * left / 100;
                        var imageWidth = pageWidth * imageWidth / 100;
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
                        var height = pageHeight * (top + 5) / 100;
                        var width = pageWidth * left / 100;
                        pdfDoc.text(value, width, height, {
                            fontSize: 12,
                            color: '#000000'
                        });
                    }
                }
            }
            pdfDoc.endPage();
        }

        Promise.all(imageArr).then(resp => {
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

        // const filePath = path.join(__dirname, '../pdf/templates/' + data.Template.id + '/' + filename);
        // fs.mkdirSync(myPath);
        // const pdfDoc = new HummusRecipe(filePath, myPath + "/attachment.pdf");
        // pdfDoc.editPage(1);

        // var imagesInfo = [];
        // var imageArr = [];
        // for (var i = 0; i < resp.length; i++) {
        //     var current = resp[i];
        //     var left = parseFloat(current['left'].replace("%", ""));
        //     var top = parseFloat(current['top'].replace("%", ""));
        //     if (current.hasOwnProperty('src')) {
        //         var imageWidth = parseFloat(current['width'].replace("%", ""));
        //         var height = pdfDoc.default.pageHeght * top / 100;
        //         var width = pdfDoc.default.pageWidth * left / 100;
        //         var imageWidth = pdfDoc.default.pageWidth * imageWidth / 100;
        //         let imagePath = path.join(__dirname, '../pdf/images/' + uuid + "-" + i);
        //         var imageInfo = {
        //             width: width,
        //             height: height,
        //             path: imagePath,
        //             src: current['src'],
        //             imageWidth: imageWidth
        //         }
        //         imagesInfo.push(imageInfo);
        //         imageArr.push(imageDataURI.outputFile(current['src'], imagePath));

        //     } else {
        //         var value = current['value'];
        //         var height = pdfDoc.default.pageHeght * top / 100;
        //         var width = pdfDoc.default.pageWidth * left / 100;
        //         pdfDoc.text(value, width, height, {
        //             fontSize: 12,
        //             color: '#000000'
        //         });
        //     }
        // }

        // Promise.all(imageArr).then(resp => {
        //     for (var i = 0; i < resp.length; i++) {
        //         pdfDoc.image(resp[i], imagesInfo[i].width, imagesInfo[i].height, {
        //             width: imagesInfo[i].imageWidth, keepAspectRatio: true
        //         });
        //     }
        //     pdfDoc.endPage();
        //     pdfDoc.endPDF();
        //     if (confirmation === true) {
        //         var confirmationFilePath = myPath + "/attachment.pdf";
        //         smtpUtil.sendConfirmation(receipient, confirmationFilePath);
        //         md5File(confirmationFilePath, (err, hash) => {
        //             job.updateJobCompletedHashByUuid(data.uuid, hash);
        //         });
        //     } else {
        //         // TODO add for more than one files
        //         res.zip([
        //             { path: myPath + "/attachment.pdf", name: filename }
        //         ], "Download.zip");
        //     }
        // });
    })
}

router.get('/api/job/download/:uuid', withAuth, (req, res) => {
    job.getJobByUuid(req.params.uuid, true).then(data => {
        generateFile(data, res);
        // res.send(data);
    });
});

router.put('/api/job/cancel/:uuid', withAuth, (req, res) => {
    job.cancelJobDataByUuid(req.params.uuid).then(data => {
        res.send(data);
    });
})

router.put('/api/job', withAuth, (req, res) => {
    // TODO: refactor to a single statement, due to time leave it for now.

    job.updateJobDataByUuid(req.body.uuid, cryptr.encrypt(req.body.data)).then(data => {
        job.getJobByUuid(req.body.uuid, true).then(data1 => {
            generateFile(data1, res, true, req.body.recipient);
            res.send(data);
        });
    });
});

router.get('/api/job', withAuth, (req, res) => {
    job.createJob().then(data => {
        res.json(data);
    });
});

router.get('/api/job/all', withAuth, (req, res) => {
    job.getAll().then(data => {
        res.json(data);
    });
});

router.get('/api/job/:uuid', withAuth, (req, res) => {
    job.getJobByUuid(req.params.uuid, true).then(data => {
        res.json(data);
    });
});

router.get('/api/sign/:uuid', withAuth, (req, res) => {
    var uuid = req.params.uuid;
    job.getJobByUuid(uuid, false).then(data => {
        if (data.phone && !data.pin) {
            securePin.generatePin(6, (pin) => {
                job.updateJobPinByUuid(uuid, pin.toString()).then(resp => {
                    client.messages
                        .create({ from: 'InitialsSG', body: 'Your Initials One-Time PIN is ' + pin + ". It will expire in 2 minutes.", to: data.phone })
                        .then(message => console.log(message.sid))
                        .done();
                });
            })
        }
        res.json(data);
    });
});

/*
    Address Book Entries
*/

router.get('/api/admin_addressbookentry', withAdminAuth, (req, res) => {
    addressbookentry.getAll().then(entries => {
        res.json(entries);
    })
});

/*
    Organization
*/

router.post('/api/organization', withAuth, (req, res) => {
    organization.createOrganization(req.body).then(org => {
        res.json(org);
    });
});

router.get('/api/organization', withAuth, (req, res) => {
    organization.getAll().then(orgs => {
        res.json(orgs);
    })
});

router.get('/api/admin_organization', withAdminAuth, (req, res) => {
    organization.getAll().then(orgs => {
        res.json(orgs);
    })
});

router.post('/api/admin_organization', withAdminAuth, (req, res) => {
    organization.createOrganization(req.body).then(org => {
        res.json(org);
    });
});

/*
    User
*/

router.get('/api/user', withAuth, (req, res) => {
    user.getAll().then(users => {
        res.json(users);
    });
});

router.post('/api/user', (req, res) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        req.body.password = hash;
        user.createUser(req.body).then(user => {
            res.json(user);
        })
    });
});

router.post('/api/login', (req, res) => {
    user.getUserForAuth(req.body.email).then(user => {
        if (user == null) {
            res.status(404).json({ 'result': 'User unknown' });
        }
        bcrypt.compare(req.body.password, user.password, function (err, resp) {
            if (resp === false) {
                res.status(400).json({ 'result': 'Password or Username is wrong' });
            } else {
                var token = jsonwebtoken.sign({
                    user: user,
                    secret: mirrorSecret
                }, secret, {
                        expiresIn: 6000
                    })
                // 15 mins cookie - 90000ms
                res.cookie('token', cryptr.encrypt(token), { expires: new Date(Date.now() + 9000000), httpOnly: true }).sendStatus(200);
            }
        });
    })
});

router.get('/api/logout', (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200);
});

router.post('/api/adminLogin', (req, res) => {
    admin.getAdminForAuth(req.body.email).then(admin => {
        if (admin == null) {
            res.status(404).json({ 'result': 'Admin User unknown' });
        }
        bcrypt.compare(req.body.password, admin.password, function (err, resp) {
            if (resp === false) {
                res.status(400).json({ 'result': 'Password or Username is wrong' });
            } else {
                var adminToken = jsonwebtoken.sign({
                    admin: admin,
                    secret: mirrorSecret
                }, secret, {
                        expiresIn: 6000
                    })
                // 15 mins cookie - 90000ms
                res.cookie('adminToken', cryptr.encrypt(adminToken), { expires: new Date(Date.now() + 9000000), httpOnly: true }).sendStatus(200);
                res.sendStatus(200);
            }
        });
    })
});

router.get('/api/adminLogout', (req, res) => {
    res.clearCookie("adminToken");
    res.sendStatus(200);
});

router.post('/api/admin', withAdminAuth, (req, res) => {
    admin.createAdmin(req.body).then(admin => {
        res.json(admin);
    })
});

router.get('/api/checkToken', withAuth, (req, res) => {
    res.sendStatus(200);
});

router.get('/api/checkAdminToken', withAdminAuth, (req, res) => {
    res.sendStatus(200);
});

router.get('/api/checkAdminList', withAdminAuth, (req, res) => {
    admin.getAll().then(data => {
        res.json(data);
    });
});

module.exports = router;
