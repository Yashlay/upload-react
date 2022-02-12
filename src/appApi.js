let axios = require('axios');
let domain = window.location.protocol + '//' + window.location.hostname;
const UPLOAD_URL = domain + "/upload";
// const INITIATE_PROCESSING_URL = domain + "/listing/";
// const POLLING_INTERVAL = 10000;

module.exports = {

    upload: (fileData) => {
        return new Promise((resolve, reject) => {
            axios.post(UPLOAD_URL, fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                resolve(response);
            })
                .catch((error) => {
                    console.log('error');
                    reject(error);
                });
        });
    },

    /*initiateProcessing: (fileId) => {
        return new Promise((resolve, reject) => {
            axios.get(INITIATE_PROCESSING_URL + fileId, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                resolve(response);
            }).catch((error) => {
                console.log('error');
                reject(error);
            });
        });
    },*/

    /*startProcessing: (fileId) => {
        return new Promise((resolve, reject) => {
            let data = {};
            let dataReceived = false;
            const initProcessing = new Request(INITIATE_PROCESSING_URL + fileId);
            initProcessing.poll(POLLING_INTERVAL).get((res) => {
                if (res.data.status === "Processed") {
                    dataReceived = true;
                    data = res.data.data;
                    return false;
                }
            });
            if (dataReceived) {
                resolve(data);
            }
        });
    }*/
}