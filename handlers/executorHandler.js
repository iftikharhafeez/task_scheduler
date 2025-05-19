const TaskService = require('../services/taskService');
const axios = require('axios');

exports.executorHandler = async (event, app) => {
    const { task } = event;
    const taskService = new TaskService(app.db, app.logger);

    try {
        if (task.action === 'webhook') {
            await axios.post(task.payload.url, task.payload.data);
        }

        await taskService.completeTask(task.task_id);
    } catch (error) {
        app.logger.error('Task execution failed:', error);
        await taskService.failTask(task.task_id);
    }
};
