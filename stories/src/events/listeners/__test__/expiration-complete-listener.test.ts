import { ExpirationCompleteEvent } from '@hn-hub/common';
import { Message } from 'node-nats-streaming';
import { Story, StoryDoc } from '../../../models/stories';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const storyData = [
    {
        "comments": [
            24124834
        ],
        "isExpired": false,
        "title": "Mozilla lays off 250 employees while it refocuses on commercial products",
        "url": "https://blog.mozilla.org/blog/2020/08/11/changing-world-changing-mozilla/",
        "score": 1583,
        "createdAt": 1597154636,
        "user": "rebelwebmaster",
        "storyId": 24120336
    },
    {
        "comments": [
            24135784
        ],
        "isExpired": false,
        "title": "Mozilla Lifeboat",
        "url": "https://mozillalifeboat.com",
        "score": 1432,
        "createdAt": 1597256213,
        "user": "gkoberger",
        "storyId": 24135032
    }
];

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const storyBuildObject: any[] = [];
    storyData.forEach(story => {
        const st = Story.build({
            by: story.user,
            score: story.score,
            time: story.createdAt + '',
            title: story.title,
            url: story.url,
            kids: story.comments!,
            id: story.storyId
        });  // building the story object
        storyBuildObject.push(st.save());   // chainning it into the Promise array
    });
    // Saving all records at once
    const stories: Array<StoryDoc> = await Promise.all(storyBuildObject);
    const data: ExpirationCompleteEvent['data'] = {
        stories: stories.map(e => e.storyId)
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, stories, data, msg };
};


it('delete all the given stories', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedStory = await Story.find({});

    expect(updatedStory.length).toEqual(0);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});