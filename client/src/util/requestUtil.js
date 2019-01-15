import axios from 'axios';
const url = process.env.REACT_APP_BACKEND || "http://localhost:5000";

export function getUrl() {
    return url
}

export function getRequest(path, data) {
    return axios.get(url + path, {
        params: data,
        withCredentials: true
    })
}

export function getBlobRequest(path, data) {
    return axios.get(url + path, {
        params: data,
        responseType: 'blob',
        withCredentials: true
    })
}

export function putRequest(path, data) {
    return axios.put(url + path, data, {
        withCredentials: true
    })
}

export function postRequest(path, data) {
    return axios.post(url + path, data, {
        withCredentials: true
    })
}