import Cryptr from 'cryptr';
import * as Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
const cryptr = new Cryptr('nk<%4]<`(6Q@X3A(0gBS5&l[X3dIE.');


export function getDecryptedJwt() {
    try {
        if (Cookies.get("initialsdemo")) {
            return cryptr.decrypt(Cookies.get("initialsdemo"));
        }
    } catch (error) {
        return "";
    }
    return "";
}

export function getUserIdFromJwt() {
    var jwt = jwtDecode(cryptr.decrypt(Cookies.get("initialsdemo")));
    var user = jwt.userId[0];
    return user.firstname + " " + user.lastname;
}
