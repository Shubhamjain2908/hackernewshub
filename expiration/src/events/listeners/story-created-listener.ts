import { Listener, StoryCreatedEvent, Subjects } from '@hn-hub/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class StoryCreatedListener extends Listener<StoryCreatedEvent> {
    subject: Subjects.StoryCreated = Subjects.StoryCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: StoryCreatedEvent['data'], msg: Message) {
        const delay = 600000;   // 10min delay (600000 ms)
        console.log('Waiting this many milliseconds to process the Job: ', delay);
        const stories = data.story.map(v => v.storyId);
        await expirationQueue.add({
            stories
        }, {
            delay
        });

        msg.ack();
    }
}