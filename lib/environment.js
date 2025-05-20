const dotenv = require('dotenv');
dotenv.config();

exports.getConfig = function () {
  return {
    EXECUTE_TAKE_FUNCTION: process.env.EXECUTE_TAKE_FUNCTION || "executor",
    isConfigRemote: process.env.IS_CONFIG_REMOTE === "true",
    isSecretRemote: process.env.IS_SECRET_REMOTE === "true"
  }
};

exports.getEnvironment = function () {
    return process.env.ENVIRONMENT;
};

exports.isProduction = function () {
    return process.env.ENVIRONMENT === 'Production';
};

exports.isStaging = function () {
    return process.env.ENVIRONMENT === 'staging';
};

exports.isDevelopment = function () {
    return process.env.ENVIRONMENT === 'Development';
};