import mongoose from 'mongoose';
import { UserDoc } from './User';

// An interface that describes the prop that are req to create a new Comments
export interface CommentsAttrs {
    text: string,
    createdAt: number,
    user: mongoose.Types.ObjectId,
    storyId: number,
    child_comment_count: number
}

// An interface that describes the properties that a Comments model has
interface CommentsModel extends mongoose.Model<CommentsDoc> {
    build(attrs: CommentsAttrs): CommentsDoc;
}

// An interface that describes the properties that a Comments Document has
export interface CommentsDoc extends mongoose.Document {
    text: string,
    createdAt: number,
    user: UserDoc,
    storyId: number,
}

const commentsSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Number
        },
        user: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        storyId: {
            type: Number,
            required: true
        },
        child_comment_count: {
            type: Number,
            default: 0
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

commentsSchema.statics.build = (attrs: CommentsAttrs) => {
    return new Comments(attrs);
};

const Comments = mongoose.model<CommentsDoc, CommentsModel>('Comments', commentsSchema);

export { Comments };

