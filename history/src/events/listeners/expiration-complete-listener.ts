import { ExpirationCompleteEvent, Listener, Subjects } from '@hn-hub/common';
import { Message } from 'node-nats-streaming';
import { Story } from '../../models/stories';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        console.log('ExpirationCompleteEvent listener from History');
        const { stories } = data;
        const storyBuildObject: any[] = [];
        stories.forEach(id => {
            const st = Story.updateOne({ storyId: id }, { isExpired: true });
            storyBuildObject.push(st);   // chainning it into the Promise array
        });
        // Saving all records at once
        await Promise.all(storyBuildObject);

        // ack the message
        msg.ack();
    }
}