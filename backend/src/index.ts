import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		const token = req.headers.authorization || '';

		try {
			if (token) {
				const decoded = jwt.verify(token.replace('Bearer ', ''), 'chave_mestra_ia')
				return { user: decoded };
			}
		} catch (e) {}
		return {}
	}
})

const startServer = async () => {
	await mongoose.connect(process.env.MONGO_URI || '');
	console.log('🚀 MongoDB Conectado');

	const server = new ApolloServer({ typeDefs, resolvers });

	const { url } = await server.listen({ port: 4000 });
	console.log(`Server pronto em ${url}`);
};

startServer();
