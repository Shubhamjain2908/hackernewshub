import { errorHandler, NotFoundError } from '@hn-hub/common';
import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';
import { getCommentsRouter } from './routes/get-comments';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(getCommentsRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

