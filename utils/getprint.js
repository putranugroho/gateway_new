const fs = require('fs');
const { format } = require('date-fns');
let logmessage
function printreq(text, header) {
    const currentdate = new Date();
    const logfilepath = format(currentdate, "yyyyMMdd") + '.log';
    logmessage = format(currentdate, "yyyy-MM-dd HH:mm:ss") + "|REQ " + header + "|" + JSON.stringify(text) + "\n";
    fs.appendFile(logfilepath, logmessage, (err) => {
        if (err) {

        } else {

        }
    });
    console.log("=========================== REQUEST " + header + " " + format(currentdate, "yyyy-MM-dd HH:mm:ss") + " ===========================");
    console.log(text);
    console.log("==============================================================================");
};

function printres(text, header) {
    const currentdate = new Date();
    const logfilepath = format(currentdate, "yyyyMMdd") + '.log';
    logmessage = format(currentdate, "yyyy-MM-dd HH:mm:ss") + "|RES " + header + "|" + JSON.stringify(text) + "\n";
    fs.appendFile(logfilepath, logmessage, (err) => {
        if (err) {

        } else {

        }
    });
    console.log("=========================== RESPONSE " + header + " " + format(currentdate, "yyyy-MM-dd HH:mm:ss") + " ===========================");
    console.log(text);
    console.log("==================================" + format(currentdate, "yyyy-MM-dd HH:mm:ss") + " =============================================");
};
module.exports = { printreq, printres }