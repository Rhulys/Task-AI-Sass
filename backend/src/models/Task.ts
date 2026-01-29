import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	complexity: { type: Number, required: true },
	category: { type: String, required: true },
	estimatedTime: Number,
	predictedTime: Number,
	actualTimeSpent: Number,
	status: { type: String, default: 'TODO' },
	completedAt: Date,
});

export const Task = mongoose.model('Task', TaskSchema);
