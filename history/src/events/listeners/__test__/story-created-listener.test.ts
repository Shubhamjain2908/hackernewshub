import { StoryCreatedEvent, StoryEventModel } from '@hn-hub/common';
import { Message } from 'node-nats-streaming';
import { Story, StoryDoc } from '../../../models/stories';
import { natsWrapper } from '../../../nats-wrapper';
import { StoryCreatedListener } from '../story-created-listener';

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

const eventData: Array<StoryEventModel> = [
    {
        comments: [24135784],
        createdAt: 15972562131,
        score: 1123,
        storyId: 24161010,
        title: 'Google com',
        url: 'https://google.com',
        user: 'SJ'
    },
    {
        comments: [
            24135784
        ],
        title: 'Mozilla Lifeboat',
        url: 'https://mozillalifeboat.com',
        score: 1432,
        createdAt: 1597256213,
        user: 'gkoberger',
        storyId: 24135032
    }
];

const setup = async () => {
    const listener = new StoryCreatedListener(natsWrapper.client);
    // Saving all records at once
    const stories: Array<StoryDoc> = await Story.insertMany(storyData);
    const data: StoryCreatedEvent['data'] = { story: eventData };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, stories, data, msg };
};

it('create new stories', async () => {
    const { listener, data, msg } = await setup();

    await Story.deleteMany({});

    await listener.onMessage(data, msg);

    const updatedStory = await Story.find({});

    expect(updatedStory.length).toEqual(2);
});

it('update one existing story & create one new', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedStory = await Story.find({});

    expect(updatedStory.length).toEqual(3);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});