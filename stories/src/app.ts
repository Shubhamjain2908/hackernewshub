import { errorHandler, NotFoundError } from '@hn-hub/common';
import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';
import { getStoriesRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(getStoriesRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };

