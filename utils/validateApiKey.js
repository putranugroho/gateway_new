require('dotenv').config;
async function validateApiKey(req, res, next) {
    const apiKey = req.headers['api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'you not authorized to use this service' });
    }
    next();
}

module.exports = { validateApiKey }