import express, { Request, Response } from 'express';
import { Story, StoryDoc } from '../models/stories';

const router = express.Router();

router.get('/past-stories', async (req: Request, res: Response) => {
    let stories: Array<StoryDoc> = await Story.find({}).sort({ createdAt: -1 });
    res.status(200).send({ stories });
});

export { router as getStoriesRouter };

