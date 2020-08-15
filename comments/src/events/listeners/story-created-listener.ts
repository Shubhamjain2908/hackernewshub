import { BadRequestError, Listener, StoryCreatedEvent, Subjects } from '@hn-hub/common';
import axios from 'axios';
import { Message } from 'node-nats-streaming';
import { Comments, CommentsAttrs, CommentsDoc } from '../../models/comments';
import { User, UserDoc } from '../../models/user';
import { queueGroupName } from './queue-group-name';

export class StoryCreatedListener extends Listener<StoryCreatedEvent> {
    subject: Subjects.StoryCreated = Subjects.StoryCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: StoryCreatedEvent['data'], msg: Message) {
        const { story: stories } = data;

        // saving comments for all the stories
        await Promise.all(stories.map(async (s) => await getCommentsFromHNFirestore(s.comments)));

        // ack the message
        msg.ack();
    }
}

/**
 * Method which fetches the comments from the HN Firestore
 * @returns
 */
const getCommentsFromHNFirestore = async (comments: Array<number>): Promise<Array<CommentsDoc>> => {

    let commentRequests: any[] = [];

    // creating the request for each comment Id
    comments.forEach((id: number) => commentRequests.push(axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
    let response = await axios.all(commentRequests);  // fetching all the comment details 
    response = response.map(r => r.data);

    const commentsToSave: Array<CommentsAttrs> = await Promise.all(response.map(async (r) => {
        const c: CommentsAttrs = {
            commentId: r.id,
            child_comment_count: r.kids?.length,
            createdAt: r.time,
            storyId: r.parent,
            text: r.text,
            user: await getUser(r.by)
        }
        return c;
    }));
    return await Comments.insertMany(commentsToSave);
}

/**
 * Methods which finds the user assosiated with the comment: either form HNFirestore or our db
 * @param username 
 */
const getUser = async (username: string): Promise<UserDoc> => {

    if (!username) {
        throw new BadRequestError('Invalid username passed');
    }

    const user = await User.findOne({ user: username });
    if (user) {
        return user;
    }

    // fetch user data from HN db.
    const { data } = await axios.get(`https://hacker-news.firebaseio.com/v0/user/${username}.json`);
    const newUser = User.build(data);
    await newUser.save();   // saving that user to our db
    return newUser;

}
