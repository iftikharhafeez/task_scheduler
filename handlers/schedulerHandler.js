const TaskService = require('../services/taskService');

exports.schedulerHandler = async (_event, app) => {
    const taskService = new TaskService(app.db, app.logger);
    await taskService.findAndRunDueTasks(app.aws);
    return { statusCode: 200, body: JSON.stringify({ message: 'Scheduler executed' }) };
};
