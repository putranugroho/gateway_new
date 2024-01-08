const crypto = require('crypto');

var secretkey = 'P@55w0rd5@lah'//'fd85b494-aaaa'
var secretiv = 'snooters'
const key = crypto.createHash('sha512').update(secretkey, 'utf-8').digest('hex').substring(0, 32);
const iv = crypto.createHash('sha512').update(secretiv, 'utf-8').digest('hex').substring(0, 16);
/*const key = Buffer.from('ITtmocBa6tANBqDNHmTJxQ==');//crypto.randomBytes(32); // 256-bit key
const iv = '57c926e311623a69a949ef7080e13a25';// crypto.randomBytes(16); // Initialization Vector
*/
function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

function decrypt(text) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(text, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted
}

module.exports = { encrypt, decrypt };