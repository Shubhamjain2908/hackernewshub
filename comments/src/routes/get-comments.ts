import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/comments', async (req: Request, res: Response) => {
    const storyId = req.params.storyId;
    res.status(200).send({ storyId });
});

export { router as getCommentsRouter };

