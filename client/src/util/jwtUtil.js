import Cryptr from 'cryptr';
import * as Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
const cryptr = new Cryptr('nk<%4]<`(6Q@X3A(0gBS5&l[X3dIE.');
const token = "token";


export function getDecryptedJwt() {
    try {
        if (Cookies.get("initialsdemo")) {
            return cryptr.decrypt(Cookies.get(token));
        }
    } catch (error) {
        return "";
    }
    return "";
}

export function getUserIdFromJwt() {
    var jwt = jwtDecode(cryptr.decrypt(Cookies.get(token)));
    var user = jwt.userId[0];
    return user.firstname + " " + user.lastname;
}


export function decryptJobData(data) {
    return cryptr.decrypt(data);
}