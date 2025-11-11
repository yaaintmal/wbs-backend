import '#db';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from '#middlewares';
import { authRouter, postRouter } from '#routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/auth', authRouter);
app.use('/posts', postRouter);

// GLOBAL MIDDLEWARES
app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[35mMain app listening at http://localhost:${port}\x1b`)
);
