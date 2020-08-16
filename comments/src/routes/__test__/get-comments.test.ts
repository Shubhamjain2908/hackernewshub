import request from 'supertest';
import { app } from '../../app';
import { Comments, CommentsDoc } from '../../models/comments';
import { User } from '../../models/user';

const insertCommentsData = async () => {

    const userData = User.build({
        "about": "John Nagle<p>www.animats.com",
        "created": 1410156919,
        "id": 234234,
        "karma": 86617
    });
    await userData.save();

    const data = [
        {
            "child_comment_count": 9,
            "commentId": "24174676",
            "createdAt": 1597547855,
            "storyId": 24169732,
            "text": "I find it really fascinating to think that when 60 minutes pass on star S62, on Earth 100 minutes would have passed in the same duration. This is Sci-Fi territory in my mind. I am having all sorts of difficulty imagining some implications of this.<p>Does this roughly mean, things are &quot;sped up&quot; in S62 from our point of view, if we could observe some activity on that star?",
            "user": userData,
        },
        {
            "child_comment_count": 8,
            "commentId": "24172814",
            "createdAt": 1597529028,
            "storyId": 24172245,
            "text": "It&#x27;s very MIT.<p>It&#x27;s also an illustration of what went wrong with the &quot;internet of things&quot; concept. Sensors are easy today. Actuators are hard. Most &quot;IoT&quot; things can&#x27;t <i>do</i> much.<p>Try to buy a home power window. They exist. They&#x27;re an exotic luxury home item. Even controllable home HVAC dampers are rare. It makes good sense to have a system where windows, fans, dampers, heaters, and compressors are all coordinated to maximize comfort at minimum cost, automatically. Will NeXT sell you that? No. It takes too much installation.<p>You might see that at a well run convention hotel. They have to keep customers happy, yet many of their big rooms are empty much of the time. So they&#x27;ll have CO, CO2, temperature, humidity, and motion sensors tied to a control system that senses what the room needs for the current people load.<p>There&#x27;s real IoT, but it&#x27;s under commercial building automation.",
            "user": userData
        },
    ];
    // Saving all records at once
    const savedRecord: Array<CommentsDoc> = await Comments.insertMany(data);
    return savedRecord;
}

it('has a route handler listening to /comments for post requests', async () => {
    const response = await request(app).get('/comments').send({});
    expect(response.status).not.toEqual(404);
});

it('throw a bad request error when storyid is not passed', async () => {
    const response = await request(app).get('/comments').send({});
    expect(response.status).toEqual(400);
});


it('get comments form the db forr a storyId', async () => {
    await insertCommentsData();
    const response = await request(app)
        .get('/comments')
        .query({ storyId: '24169732' })
        .expect(200);

    expect(response.body.comments).toBeDefined();
    expect(response.body.comments.length).toEqual(1);
});

