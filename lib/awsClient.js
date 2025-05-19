const AWS = require('aws-sdk');

module.exports = () => {
    return new AWS.Lambda({
        region: process.env.AWS_REGION || 'us-east-1'
    });
};
