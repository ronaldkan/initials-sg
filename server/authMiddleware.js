const jwt = require('jsonwebtoken');
const secret = '%ivlkCTaW;<Fk@L#cBVK:!yHbZ/y)3';
var Cryptr = require('cryptr');
var cryptr = new Cryptr('nk<%4]<`(6Q@X3A(0gBS5&l[X3dIE.');

const withAuth = function (req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token;
    
    if (!token) {
        res.clearCookie("token").status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(cryptr.decrypt(token), secret, function (err, decoded) {
            if (err) {
                res.clearCookie("token").status(401).send('Unauthorized: Invalid token');
            } else {
                req.importedUser = decoded.user;
                next();
            }
        });
    }
}
module.exports = withAuth;