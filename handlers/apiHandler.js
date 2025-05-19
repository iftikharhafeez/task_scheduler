const { v4: uuidv4 } = require('uuid');
const TaskService = require('../services/taskService');

exports.apiHandler = async (event, app) => {
    const body = JSON.parse(event.body || '{}');
    const { action, payload, run_at } = body;

    if (!action || !payload || !run_at) {
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid request" }) };
    }

    const task = {
        task_id: uuidv4(),
        action,
        payload,
        run_at,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const taskService = new TaskService(app.db, app.logger);
    await taskService.scheduleTask(task);

    return {
        statusCode: 201,
        body: JSON.stringify({ task_id: task.task_id, status: task.status })
    };
};
