import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
    roomId: string;
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
}

const ChatMessageSchema: Schema = new Schema({
    roomId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
