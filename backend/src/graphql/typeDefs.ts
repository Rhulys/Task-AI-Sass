import { gql } from 'apollo-server';

export const typeDefs = gql`
	type User {
		id: ID!
		email: String!
	}

	type Task {
		id: ID!
		title: String!
		complexity: Int!
		category: String!
		predictedTime: Float
		actualTimeSpent: Float
		status: String!
	}

	type Query {
		getTasks: [Task]
		me: User
	}

	type Mutation {
		register(email: String!, password: String!): String
		login(email: String!, password: String!): String
		
		createTask(title: String!, complexity: Int!, category: String!): Task
		deleteTask(id: ID!): Boolean
		updateTaskStatus(id: ID!, status: String!): Task
		completeTask(id: ID!, actualTimeSpent: Float!): Task
		updateTask(id: ID!, title: String, complexity: Int, category: String): Task
	}
`;
