import axios from 'axios';
import { getDecryptedJwt } from './jwtUtil';
import * as Cookies from 'js-cookie';
const url = process.env.REACT_APP_BACKEND || "http://localhost:5000";

function getConfig() {
    
    var axiosObj = axios.create({
        baseURL: url,
        timeout: 10000,
    });
    var decrpytedJwt = getDecryptedJwt();
    if (decrpytedJwt !== "") {
        axiosObj = axios.create({
            baseURL: url,
            timeout: 10000,
            headers: {
                common: {
                    authorization: "Bearer " + decrpytedJwt
                }
            }
        })
    }

    axiosObj.interceptors.response.use(response => {
        return response
    }, function(err) {
        Cookies.remove("initialsdemo");
        return Promise.reject(err);
    });
    return axiosObj;
}


export function getUrl() {
    return url
}

export function getRequest(path, data) {
    return getConfig().get(path, {
        params: data
    })
}

export function getBlobRequest(path, data) {
    return axios.get(url + path, {
        params: data,
        responseType: 'blob'
    })
}

export function putRequest(path, data) {
    return getConfig().put(url + path, data)
}

export function postRequest(path, data) {
    return getConfig().post(url + path, data)
}