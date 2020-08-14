import express, { Request, Response } from 'express';
import { Comments, CommentsDoc } from '../models/comments';

const router = express.Router();

interface CommentResponse {
    text: string,
    username: string,
    usersAge: number
}

router.get('/comments', async (req: Request, res: Response) => {
    const storyId = +req.params.storyId;
    const comments: Array<CommentsDoc> = await Comments.find({ storyId: storyId }).sort({ child_comment_count: -1 }).populate('User');
    const commentResponse: Array<CommentResponse> = comments.map(comment => {
        return {
            text: comment.text,
            username: comment.user.user,
            usersAge: new Date(Date.now()).getFullYear() - new Date(comment.user.createdAt).getFullYear()
        }
    });
    res.status(200).send({ comments: commentResponse });
});

export { router as getCommentsRouter };

