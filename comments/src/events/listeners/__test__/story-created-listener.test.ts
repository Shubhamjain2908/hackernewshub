import { StoryCreatedEvent, StoryEventModel } from '@hn-hub/common';
import { Comments } from '../../../models/comments';
import { User } from '../../../models/user';
import { natsWrapper } from '../../../nats-wrapper';
import { StoryCreatedListener } from '../story-created-listener';

const eventData: Array<StoryEventModel> = [
    {
        comments: [24172814],
        createdAt: 15972562131,
        score: 1123,
        storyId: 24172245,
        title: 'Google com',
        url: 'https://google.com',
        user: 'Animats'
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
    },
    {
        comments: [
            24173903
        ],
        title: 'Mozilla Lifeboat',
        url: 'https://mozillalifeboat.com',
        score: 1432,
        createdAt: 1597256213,
        user: 'axaxs',
        storyId: 24135032
    }
];

const setup = async () => {
    const listener = new StoryCreatedListener(natsWrapper.client);

    const data: StoryCreatedEvent['data'] = { story: eventData };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('create new comments', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const comments = await Comments.find({});

    expect(comments.length).toEqual(3);
});

it('created new users', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const users = await User.find({});

    expect(users.length).toEqual(3);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});