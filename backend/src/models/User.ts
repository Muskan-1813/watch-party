import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    username: string;
    lastJoinedRoom?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    lastJoinedRoom: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
