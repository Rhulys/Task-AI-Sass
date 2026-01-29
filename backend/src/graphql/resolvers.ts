import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from '../models/User';
import { Task } from '../models/Task';
import { predictTaskDuration } from '../services/aiService';

const SECRET = process.env.JWT_SECRET || 'chave_mestra_ia'

export const resolvers = {
	Query: {
		getTasks: async () => await Task.find(),
	},
	Mutation: {
		register: async (_: any, { email, password }: any) => {
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = new User({ email, password: hashedPassword});
			await user.save()
			return "Usuário criado!"
		},
		login: async (_: any, { email, password }: any) => {
			const user = await User.findOne({ email });
			if (!user) throw new Error("Usuário não encontrado");

			const valid = await bcrypt.compare(password, user.password);
			if (!valid) throw new Error("Senha incorreta");

			return jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d'})
		},
		createTask: async (_: any, args: any) => {
			const prediction = await predictTaskDuration(
				args.complexity,
				args.category
			);

			const finalPrediction = prediction < 0.5 ? 0.5 : prediction;

			const newTask = new Task({
				title: args.title,
				complexity: args.complexity,
				category: args.category,
				predictedTime: finalPrediction,
				status: 'TODO',
			});

			await newTask.save();
			return newTask;
		},
		deleteTask: async (_: any, { id }: { id: string }) => {
			await Task.findByIdAndDelete(id);
			return true
		},
		updateTaskStatus: async (_: any, { id, status}: {id: string, status: string}) => {
			return await Task.findByIdAndUpdate(id, { status }, { new: true});
		},
		completeTask: async (_: any, { id, actualTimeSpent }:{ id: string, actualTimeSpent: number}) => {
			return await Task.findByIdAndUpdate(
				id,
				{
					status: 'DONE',
					actualTimeSpent,
					completedAt: new Date()
				},
				{ new: true }
			)
		}, 
		updateTask: async (_: any, { id, ...args }: any) => {
			const task = await Task.findById(id)
			if (!task) throw new Error("Tarefa não encontrada")

			if (args.complexity || args.category) {
				const newComplexity = args.complexity || task.complexity;
				const newCategory = args.category || task.category;

				task.predictedTime = await predictTaskDuration(newComplexity, newCategory)
			}

			if (args.title) task.title = args.title
			if (args.complexity) task.complexity = args.complexity
			if (args.category) task.category = args.category

			await task.save()
			return task;
		}
	},
};
