import axios from 'axios';
import express, { Request, Response } from 'express';
import { Story, StoryAttrs, StoryDoc } from '../models/stories';

const router = express.Router();

router.get('/top-stories', async (req: Request, res: Response) => {
    let stories: Array<StoryDoc>;
    stories = await getStoriesFromOurDatastore();
    if (!stories) {
        const storyObjects: Array<StoryAttrs> = await getStoriesFromHNFirestore();;
        stories = await saveStoriesToDB(storyObjects);
    }
    res.status(201).send({ stories });
});

const getStoriesFromOurDatastore = async (): Promise<Array<StoryDoc>> => {
    return await Story.find({}).sort({ score: -1 });
}

/**
 * Method which fetches the stories from the HN Firestore
 * @returns allStoriesFetched
 */
const getStoriesFromHNFirestore = async (): Promise<Array<StoryAttrs>> => {

    // fetching the top stories record
    const { data: storiesId } = await axios.get(`https://hacker-news.firebaseio.com/v0/topstories.json`);
    let storyRequests: any[] = [];

    // creating the request for each storyId
    storiesId.map((id: number) => storyRequests.push(axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
    const response = await axios.all(storyRequests);  // fetching all the story details 
    const allStoriesResponse: Array<StoryAttrs> = response.map(d => d.data);
    // sorting the stories on the bases of score & getting top 10 from it
    return allStoriesResponse.sort((a: StoryAttrs, b: StoryAttrs) => b.score - a.score).slice(0, 10);
    // return allStoriesResponse.filter(a => new Date(Date.now() - 600000) < new Date(+a.time)).sort((a: StoryAttrs, b: StoryAttrs) => b.score - a.score).slice(0, 10); // filter for last 10 min stories
}

/**
 * Method to save all the fetched stories to save into the db
 * @param stories
 * @returns savedStoryObject
 */
const saveStoriesToDB = async (stories: Array<StoryAttrs>): Promise<Array<StoryDoc>> => {
    const storyBuildObject: any[] = [];
    stories.forEach(story => {
        const st = Story.build(story);  // building the story object
        storyBuildObject.push(st.save());   // chainning it into the Promise array
    });
    // Saving all records at once
    const savedRecord: Array<StoryDoc> = await Promise.all(storyBuildObject);
    return savedRecord;
}

export { router as getStoriesRouter };

