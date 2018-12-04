var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
const multer = require('multer');
const HummusRecipe = require('hummus-recipe');
var zip = require('express-zip');
var imageDataURI = require('image-data-uri');

const smtpUtil = require('../utils/smtp');
var folderPath = path.join(__dirname, '../pdf/');
var template = require('../services/template');
var job = require('../services/job');
var rimraf = require('rimraf');
var QRCode = require('qrcode');
var md5File = require('md5-file');
var securePin = require("secure-pin");

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

router.post('/api/upload', upload.single('file'), (req, res) => {
    res.send({ result: 'success' });
});

router.get('/api/test1', (req, res) => {
    // client.messages
    //   .create({from: 'Initials', body: 'hello there', to: '+6594354042'})
    //   .then(message => console.log(message.sid))
    //   .done();
    // const filePath = path.join(__dirname, '../pdf/generated/ac31a4a6-a5fa-408e-9257-3cb6a3ef82b3/attachment.pdf');
    // md5File(filePath, (err, hash) => {
    //     console.log(hash);
    //     res.send({ result: 'success' });
    // });
    // var pdf = new HummusRecipe(filePath, path.join(__dirname, '../pdf/completed1.pdf'));
    // console.log(pdf.metadata);
    // res.send({ result: 'success' });
    securePin.generatePin(6, (pin) => {
        console.log("Pin: " + pin);
        res.send({ result: 'success' });
    })
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

router.post('/api/save', (req, res) => {
    template.updateTemplate(req.body.filename, req.body.components).then(function (data) {
        res.send({ result: 'success' });
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
                let imagePath = path.join(__dirname, '../pdf/images/' + uuid);
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

router.get('/api/test', (req, res) => {
    template.getAll().then(data => {
        res.json(data);
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

// API calls
// router.get('/api/hello', (req, res) => {
//     res.send({ express: 'Hello From Express' });
// });

// router.get('/api/token', (req, res) => {
//     var token = jsonwebtoken.sign({}, secret, {
//         expiresIn: 60
//     });
//     res.json({ 'content': cryptr.encrypt(token) });
// });

// router.get('/api/view', jwt({secret: secret}), (req, res) => {
//     var file = req.query.file;
//     var filePath = folderPath + file;
//     res.sendFile(filePath);
// });

// router.get('/api/view', (req, res) => {
//     var file = req.query.file;
//     var filePath = folderPath + "nda.pdf";
//     res.sendFile(filePath);
// });

// router.get('/api/file', (req, res) => {
//     fs.readdir(folderPath, (err, files) => {
//         var allFiles = [];
//         files.forEach(element => {
//             if (element !== '.DS_Store') {
//                 allFiles.push(element);
//             }
//         });
//         res.send({ 'content': allFiles });
//     })
// });

module.exports = router;
