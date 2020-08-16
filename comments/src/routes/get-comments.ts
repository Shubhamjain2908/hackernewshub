import { BadRequestError } from '@hn-hub/common';
import express, { Request, Response } from 'express';
import { Comments, CommentsDoc } from '../models/comments';

const router = express.Router();

interface CommentResponse {
    id: number,
    text: string,
    username: string,
    usersAge: number
}

router.get('/comments', async (req: Request, res: Response) => {
    const storyId = +req.query.storyId!;
    if (!storyId) {
        throw new BadRequestError('Story id is required');
    }
    const comments: Array<CommentsDoc> = await Comments.find({ storyId: storyId }).sort({ child_comment_count: -1 }).limit(10).populate('user');
    const commentResponse: Array<CommentResponse> = comments.map(comment => {
        return {
            id: comment.id,
            text: comment.text,
            username: comment.user.user,
            usersAge: new Date(Date.now()).getFullYear() - new Date(comment.user.createdAt).getFullYear()
        }
    });
    res.status(200).send({ comments: commentResponse });
});

export { router as getCommentsRouter };

