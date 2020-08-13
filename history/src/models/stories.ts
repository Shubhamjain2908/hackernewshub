import mongoose from 'mongoose';

// An interface that describes the prop that are req to create a new Story
export interface StoryAttrs {
    storyId: number,
    title: string,
    url: string,
    score: number,
    createdAt: number,
    user: string,
    comments: Array<number>
}

// An interface that describes the properties that a Story model has
interface StoryModel extends mongoose.Model<StoryDoc> {
    build(attrs: StoryAttrs): StoryDoc;
}

// An interface that describes the properties that a Story Document has
export interface StoryDoc extends mongoose.Document {
    title: string,
    url: string,
    score: number,
    createdAt: number,
    user: string,
    storyId: number,
    isExpired: boolean
}

const storySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        url: {
            type: String
        },
        score: {
            type: Number
        },
        createdAt: {
            type: Number
        },
        user: {
            type: String,
            required: true
        },
        comments: {
            type: Array
        },
        storyId: {
            type: Number,
            required: true
        },
        isExpired: {
            type: Boolean,
            default: false
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
    return new Story(attrs);
};

const Story = mongoose.model<StoryDoc, StoryModel>('Story', storySchema);

export { Story };

