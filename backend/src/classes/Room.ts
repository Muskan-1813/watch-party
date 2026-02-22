import { Participant } from './Participant';
import type { RoomState, Role } from '../types';

export class Room {
    private participants: Map<string, Participant> = new Map();
    private videoId: string = 'dQw4w9WgXcQ'; // Default video
    private playing: boolean = false;
    private currentTime: number = 0;
    private lastSyncTime: number = Date.now();

    constructor(public readonly roomId: string) { }

    addParticipant(userId: string, username: string): Participant {
        const isFirst = this.participants.size === 0;
        const role: Role = isFirst ? 'host' : 'participant';
        const participant = new Participant(userId, username, role);
        this.participants.set(userId, participant);
        return participant;
    }

    removeParticipant(userId: string): boolean {
        const p = this.participants.get(userId);
        if (!p) return false;

        this.participants.delete(userId);

        // If host left, transfer host
        if (p.role === 'host' && this.participants.size > 0) {
            const next = this.participants.values().next().value;
            if (next) next.role = 'host';
        }

        return true;
    }

    getState(): RoomState {
        return {
            roomId: this.roomId,
            videoId: this.videoId,
            playing: this.playing,
            currentTime: this.currentTime,
            participants: Array.from(this.participants.values()).map(p => p.getState()),
        };
    }

    sync(playing: boolean, time: number) {
        this.playing = playing;
        this.currentTime = time;
        this.lastSyncTime = Date.now();
    }

    setVideo(videoId: string) {
        this.videoId = videoId;
        this.currentTime = 0;
        this.playing = false;
    }

    getParticipant(userId: string): Participant | undefined {
        return this.participants.get(userId);
    }

    canControl(userId: string): boolean {
        const p = this.participants.get(userId);
        return p ? (p.role === 'host' || p.role === 'moderator') : false;
    }

    isHost(userId: string): boolean {
        const p = this.participants.get(userId);
        return p ? (p.role === 'host') : false;
    }

    assignRole(userId: string, role: Role) {
        const p = this.participants.get(userId);
        if (p && p.role !== 'host') {
            p.role = role;
        }
    }
}
