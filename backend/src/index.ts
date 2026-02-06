import { createContext } from '../src/graphql/context/index.js';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';

import { UserResolver } from './resolvers/user.resolver.js';
import { AuthResolver } from './resolvers/auth.resolver.js';

import { expressMiddleware } from '@as-integrations/express5';

import cors from 'cors';
import { CategoryResolver } from './resolvers/category.resolver.js';
import { TransactionResolver } from './resolvers/transaction.resolver.js';


async function bootstrap() { 
    const app = express();

    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }));

    const schema = await buildSchema({

        resolvers: [UserResolver, AuthResolver, CategoryResolver, TransactionResolver],
        validate: false,
        emitSchemaFile: './schema.graphql',
    });

    const server = new ApolloServer({
        schema,
    });

    await server.start();

    app.use(
        '/graphql',
        express.json(), 
        expressMiddleware(server, {
            context: createContext,
        })
    );

    app.listen(({
        port: 4000
    }), () => {
        console.log('Server is running on port 4000');
    });


}

bootstrap();