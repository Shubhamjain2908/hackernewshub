import mongoose from 'mongoose';

// An interface that describes the prop that are req to create a new Story
interface StoryAttrs {
    by: string,
    descendants?: number,
    id: string | number,
    kids?: Array<number | string>
    score: number,
    time: string,
    title: string,
    type?: string,
    url: string
}

// An interface that describes the properties that a Story model has
interface StoryModel extends mongoose.Model<StoryDoc> {
    build(attrs: StoryAttrs): StoryDoc;
}

// An interface that describes the properties that a Story Document has
interface StoryDoc extends mongoose.Document {
    title: string,
    url: string,
    score: number,
    createdAt: string,
    user: string
}

const storySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        score: {
            type: String,
            required: true
        },
        createdAt: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        },
        comments: {
            type: Array
        },
        storyId: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                ret._id = undefined;
            }
        },
        versionKey: false
    }
);

storySchema.statics.build = (attrs: StoryAttrs) => {
    return new Story({
        title: attrs.title,
        url: attrs.url,
        score: attrs.score,
        createdAt: attrs.time,
        user: attrs.by,
        comments: attrs.kids,
        storyId: attrs.id
    });
};

const Story = mongoose.model<StoryDoc, StoryModel>('Story', storySchema);

export { Story };

