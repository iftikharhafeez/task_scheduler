const AWS = require('aws-sdk');

module.exports = () => {
    const isOffline = process.env.IS_OFFLINE;

    return new AWS.DynamoDB.DocumentClient({
        region: process.env.AWS_REGION || 'ca-central-1',
        endpoint: isOffline ? 'http://localhost:8000' : undefined
    });
};
// This code initializes a DynamoDB DocumentClient for AWS SDK.
// If the application is running offline (e.g., in a local development environment),