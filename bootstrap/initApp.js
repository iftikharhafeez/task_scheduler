const logger = require('../lib/logger');
const dbClient = require('../models/dbClient');
const awsClient = require('../lib/awsClient');

function initApp() {
    return {
        logger,
        db: dbClient(),
        aws: awsClient()
    };
}

module.exports = { initApp };
