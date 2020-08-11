import express, { Request, Response } from 'express';

const router = express.Router();

router.post(
    '/top-stories',
    async (req: Request, res: Response) => {

        res.status(201).send({ stories: 'top-stories' });
    }
);

export { router as getStoriesRouter };

