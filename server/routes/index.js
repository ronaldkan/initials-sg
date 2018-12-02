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
        res.send({ result: 'success' })
    });
});

router.get('/api/send', (req, res) => {
    var info = req.query;
    job.createJob(info.to, info.subject, info.message, info.TemplateId, info.data).then(function (data) {
        info["url"] = url + "/demo/sign/" + data.uuid;
        smtpUtil.sendEmail(info);
        res.send({ result: 'success' });
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
                smtpUtil.sendConfirmation(receipient, myPath + "/attachment.pdf");
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
    job.getJobByUuid(req.params.uuid, false).then(data => {
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
