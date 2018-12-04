import axios from 'axios';
const url = process.env.REACT_APP_BACKEND|| "http://localhost:5000";

export function getUrl() {
    return url
} 

export function getRequest(path, data) {
    return axios.get(url + path, {
        params: data,
    })
}

export function getBlobRequest(path, data) {
    return axios.get(url + path, {
        params: data,
        responseType: 'blob'
    })
}

export function putRequest(path, data) {
    return axios.put(url + path, data)
}

export function postRequest(path, data) {
    return axios.post(url + path, data)
}