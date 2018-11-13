var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
const multer = require('multer');
const HummusRecipe = require('hummus-recipe');
var zip = require('express-zip');

const smtpUtil = require('../utils/smtp');
var folderPath = path.join(__dirname, '../pdf/');
var template = require('../services/template');
var job = require('../services/job');


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
    job.createJob(info.to, info.subject, info.subject, info.TemplateId, info.data).then(function (data) {
        info["url"] = "http://localhost:3000/demo/sign/" + data.uuid;
        smtpUtil.sendEmail(info);
        res.send({ result: 'success' });
    });
});

// var generateFile = function (filename, uuid, data) {
//     const myPath = path.join(__dirname, '../pdf/generated/' + uuid);
//     const filePath = path.join(__dirname, '../pdf/' + filename);
//     fs.mkdirSync(myPath);
//     const pdfDoc = new HummusRecipe(filePath, myPath + "/attachment.pdf");
//     data = JSON.parse(data);
//     pdfDoc.editPage(1);
//     for (var i = 0; i < data.length; i++) {
//         var left = parseFloat(data[i].left.replace("%", ""));
//         var top = parseFloat(data[i].top.replace("%", ""));
//         var value = data[i].value;
//         var height = pdfDoc.default.pageHeght * top / 100;
//         var width = pdfDoc.default.pageWidth * left / 100;
//         console.log(height);
//         console.log(width);
//         // pdfDoc.text(value, width, height, {
//         //     fontSize: 12
//         // });
//     }
//     pdfDoc.endPage();
//     pdfDoc.endPDF();
// }

// router.get("/api/test1", (req, res) => {
//     generateFile("abc", "abc", "b58c01cb-acfa-44aa-a08b-d9f80247ef3b");
//     res.send({ result: 'success' });
// });

router.put('/api/job', (req, res) => {
    // generateFile(req.body.file, req.body.uuid, req.body.data);
    job.updateJobDataByUuid(req.body.uuid, req.body.data).then(data => {
        smtpUtil.sendConfirmation(req.body.recipient);
        res.send(data);
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
    console.log(req.params.uuid);
    job.getJobByUuid(req.params.uuid).then(data => {
        res.json(data);
    });
});


// API calls
router.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

router.get('/api/token', (req, res) => {
    var token = jsonwebtoken.sign({}, secret, {
        expiresIn: 60
    });
    res.json({ 'content': cryptr.encrypt(token) });
});

// router.get('/api/view', jwt({secret: secret}), (req, res) => {
//     var file = req.query.file;
//     var filePath = folderPath + file;
//     res.sendFile(filePath);
// });

router.get('/api/view', (req, res) => {
    var file = req.query.file;
    var filePath = folderPath + "nda.pdf";
    res.sendFile(filePath);
});

router.get('/api/file', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        var allFiles = [];
        files.forEach(element => {
            if (element !== '.DS_Store') {
                allFiles.push(element);
            }
        });
        res.send({ 'content': allFiles });
    })
});

module.exports = router;