const { ObjectId } = require("mongodb");

const { getCollection } = require("../../utils/db");
const { sendMessage } = require("../../utils/web-socket");

exports.add = async (req, res) => {

    const tasksCollection = await getCollection('tasks')
    try {

        const { title, due, description = '', assigned, location, status } = req.body;

        const result = await tasksCollection.insertOne({ title, due, description, assigned, location, status });

        sendMessage(assigned, "Task added!")

        res.json({ message: 'Task added', taskId: result.insertedId });
    } catch (error) {
        console.error('Add task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.modify = async (req, res) => {
    try {
        const tasksCollection = await getCollection('tasks')
        const task = await tasksCollection.findOne({ "_id": new ObjectId(req.body._id) })
        if (!task) {
            res.status(401).json({ message: 'Invalid task id' })
        }

        const newValues = {}

        const updateField = field => {
            if (req.body[field]) {
                newValues[field] = req.body[field]
            }
        }

        const taskFields = ['title', 'due', 'description', 'assigned', 'location', 'status']
        taskFields.forEach(f => updateField(f))


        if (newValues.assigned != task.assigned) {
            sendMessage(newValues.assigned, "Task assigned to you!")
        }
        await tasksCollection.updateOne({ _id: task._id }, { $set: newValues })
        res.json({ message: 'Task changed', taskId: task._id });
    } catch (error) {
        console.error('Change task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const tasksCollection = await getCollection('tasks')

        const result = await tasksCollection.find({}).toArray();
        const jsonDocs = JSON.stringify(result);
        res.json({ data: JSON.parse(jsonDocs) });

    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}