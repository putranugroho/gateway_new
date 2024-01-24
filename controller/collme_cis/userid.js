const { response } = require('express');
const { callAPI } = require('../../utils/execAPI');
const { printreq, printres } = require('../../utils/getprint');
const { insertlog } = require('../../utils/log_collme');

const { URL_COLLME, API_KEY_COLLME } = process.env

async function getalluserid(req) {
    var response
    try {
        response = await callAPI(URL_COLLME, req, { API_KEY_COLLME })
    } catch (error) {
        response = {
            code: '099',
            status: 'fail',
            message: 'The server is busy, please try again later'
        }
    }
    return response;

}
module.exports = { getalluserid }