const { initApp } = require('./bootstrap/initApp');
const { apiHandler } = require('./handlers/apiHandler');
const { schedulerHandler } = require('./handlers/schedulerHandler');
const { executorHandler } = require('./handlers/executorHandler');

const app = initApp();

exports.api = async (event) => apiHandler(event, app);
exports.scheduler = async (event) => schedulerHandler(event, app);
exports.executor = async (event) => executorHandler(event, app);
exports.app = app;
