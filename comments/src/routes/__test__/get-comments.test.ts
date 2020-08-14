import request from 'supertest';
import { app } from '../../app';

// const insertStoryData = async () => {
//     const data = [
//         {
//             "comments": [
//                 24161376,
//                 24161266,
//                 24161381,
//                 24161095,
//                 24160734,
//                 24160894,
//                 24161147,
//                 24160855,
//                 24160957,
//                 24160921
//             ],
//             "isExpired": true,
//             "createdAt": 1597425736,
//             "storyId": 24160621,
//             "title": "SpaceX Starlink speeds revealed as beta users get downloads of 11 to 60Mbps",
//             "url": "https://arstechnica.com/information-technology/2020/08/spacex-starlink-beta-tests-show-speeds-up-to-60mbps-latency-as-low-as-31ms/",
//             "user": "trulyrandom",
//             "score": 37,
//             "id": "5f36d602bf3b64004dbb3583"
//         },
//         {
//             "comments": [],
//             "isExpired": true,
//             "createdAt": 1597425674,
//             "storyId": 24160608,
//             "title": "Django Async: What's new and what's next?",
//             "url": "https://deepsource.io/blog/django-async-support/",
//             "user": "sanketsaurav",
//             "score": 14,
//             "id": "5f36d538bf3b64004dbb357c"
//         },
//     ];
//     // Saving all records at once
//     const savedRecord: Array<StoryDoc> = await Story.insertMany(data);
//     return savedRecord;
// }

it('has a route handler listening to /comments for post requests', async () => {
    const response = await request(app).get('/comments').send({});
    expect(response.status).not.toEqual(404);
});

// it('get stories form the db', async () => {
//     const stories = await insertStoryData();
//     const response = await request(app)
//         .get('/past-stories')
//         .expect(200);

//     expect(response.body.stories).toBeDefined();
//     expect(response.body.stories.length).toEqual(stories.length);
//     expect(response.body.stories[0].storyId).toEqual(stories[0].storyId);
//     expect(response.body.stories[1].storyId).toEqual(stories[1].storyId);
// });