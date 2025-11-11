import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import '#db';
import { authRoutes, postRoutes, userRoutes } from '#routes';
import { errorHandler } from '#middlewares';
import { openapiSpec } from '#docs';

const app = express();
const port = 3000;

// COOKIE & BODY PARSER
app.use(express.json());
app.use(cookieParser());

//CORS POLICY
// simple version when credentials not needed
// app.use(cors());
app.use(
	cors({
		origin: process.env.CLIENT_BASE_URL,
		credentials: true,
		exposedHeaders: ['WWW-Authenticate']
	})
);

// ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// DOCs
app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpec));

app.use(errorHandler);

app.listen(port, () => {
	console.log(`\x1b[35mMain app listening at http://localhost:${port}\x1b`);
	console.log(
		`\x1d[17mSwagger Docs available at:http://localhost:${port}/docs\x1b`
	);
});
