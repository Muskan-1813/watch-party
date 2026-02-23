import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../types';

export interface IParticipant {
    userId: string;
    username: string;
    role: Role;
}

export interface IRoom extends Document {
    roomId: string;
    videoId: string;
    playing: boolean;
    currentTime: number;
    participants: IParticipant[];
    createdAt: Date;
    updatedAt: Date;
}

const ParticipantSchema = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ['host', 'moderator', 'participant', 'viewer'], default: 'participant' },
}, { _id: false });

const RoomSchema: Schema = new Schema({
    roomId: { type: String, required: true, unique: true },
    videoId: { type: String, default: 'dQw4w9WgXcQ' },
    playing: { type: Boolean, default: false },
    currentTime: { type: Number, default: 0 },
    participants: [ParticipantSchema],
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', RoomSchema);
