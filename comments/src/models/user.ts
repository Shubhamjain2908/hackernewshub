import mongoose from 'mongoose';

// An interface that describes the prop that are req to create a new User
export interface UserAttrs {
    about: string,
    created: number,
    id: number,
    karma: number
}

// An interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
export interface UserDoc extends mongoose.Document {
    about: string,
    createdAt: number,
    user: string
}

const userSchema = new mongoose.Schema(
    {
        about: {
            type: String
        },
        createdAt: {
            type: Number,
            required: true
        },
        user: {
            type: String,
            required: true,
            unique: true
        },
        karma: {
            type: Number
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

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User({
        about: attrs.about,
        createdAt: attrs.created,
        user: attrs.id,
        karma: attrs.karma
    });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };

