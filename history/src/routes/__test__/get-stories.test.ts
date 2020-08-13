import request from 'supertest';
import { app } from '../../app';
import { Story, StoryDoc } from '../../models/stories';
import { natsWrapper } from '../../nats-wrapper';

const insertStoryData = async () => {
    const data = [
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
    const storyBuildObject: any[] = [];
    data.forEach(story => {
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
    const savedRecord: Array<StoryDoc> = await Promise.all(storyBuildObject);
    return savedRecord;
}

it('has a route handler listening to /top-stories for post requests', async () => {
    await insertStoryData();
    const response = await request(app).get('/top-stories').send({});
    expect(response.status).not.toEqual(404);
});

it('get stories form the db', async () => {
    const stories = await insertStoryData();
    const response = await request(app)
        .get('/top-stories')
        .expect(200);

    expect(response.body.stories).toBeDefined();
    expect(response.body.stories.length).toEqual(stories.length);
    expect(response.body.stories[0].storyId).toEqual(stories[0].storyId);
    expect(response.body.stories[1].storyId).toEqual(stories[1].storyId);
});

it('publishes an event', async () => {
    await Story.deleteMany({});

    await request(app)
        .get('/top-stories')
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});