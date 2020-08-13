import { ExpirationCompleteEvent, Listener, Subjects } from '@hn-hub/common';
import { Message } from 'node-nats-streaming';
import { Story } from '../../models/stories';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

        const { stories } = data;
        // Find all the stories
        const storiesExists = await Story.find({ storyId: { $in: stories } });

        // If no stories, throw error
        if (!storiesExists) {
            throw new Error('Stories not found');
        }

        // delete the expired story
        const deletedStories = await Story.deleteMany({ storyId: { $in: stories } });

        //todo: clear from the cache
        console.log('Deleted stories: ', deletedStories);

        // ack the message
        msg.ack();
    }
}