import express from 'express';
import cookieParser from 'cookie-parser';
import '#db';
import { authRoutes, postRoutes, userRoutes } from '#routes';
import { errorHandler } from '#middlewares';

const app = express();
const port = 3000;

// body-parser
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[35mMain app listening at http://localhost:${port}\x1b`)
);
