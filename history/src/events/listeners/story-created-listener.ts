import { Listener, StoryCreatedEvent, Subjects } from '@hn-hub/common';
import { Message } from 'node-nats-streaming';
import { Story } from '../../models/stories';
import { queueGroupName } from './queue-group-name';

export class StoryCreatedListener extends Listener<StoryCreatedEvent> {
    subject: Subjects.StoryCreated = Subjects.StoryCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: StoryCreatedEvent['data'], msg: Message) {
        console.log('StoryCreatedEvent listener from History');
        const { story } = data;
        const storyIds = story.map(s => s.storyId);

        // Find all the stories
        const storiesExists = await Story.find({ storyId: { $in: storyIds } });

        if (storiesExists?.length) {
            const existStoryMap = new Map();
            const storyBuildObject: any[] = [];
            storiesExists.forEach(story => {
                existStoryMap.set(story.storyId, true);
                const st = Story.updateOne({ storyId: story.storyId }, { isExpired: false });
                storyBuildObject.push(st);   // chainning it into the Promise array
            });
            // updating all records at once
            await Promise.all(storyBuildObject);

            // Saving the rest to the db as new entry
            const newStoryBuildObject: any[] = [];
            story.forEach(story => {
                if (!existStoryMap.has(story.storyId)) {
                    const st = Story.build(story);
                    newStoryBuildObject.push(st.save());
                }
            });
            // saving rest of the recoeds records at once
            await Promise.all(newStoryBuildObject);
        } else {
            await Story.insertMany(story);
        }

        // ack the message
        msg.ack();
    }
}