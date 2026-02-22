"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const Participant_1 = require("./Participant");
class Room {
    constructor(roomId) {
        this.roomId = roomId;
        this.participants = new Map();
        this.videoId = 'dQw4w9WgXcQ'; // Default video
        this.playing = false;
        this.currentTime = 0;
        this.lastSyncTime = Date.now();
    }
    addParticipant(userId, username) {
        const isFirst = this.participants.size === 0;
        const role = isFirst ? 'host' : 'participant';
        const participant = new Participant_1.Participant(userId, username, role);
        this.participants.set(userId, participant);
        return participant;
    }
    removeParticipant(userId) {
        const p = this.participants.get(userId);
        if (!p)
            return false;
        this.participants.delete(userId);
        // If host left, transfer host
        if (p.role === 'host' && this.participants.size > 0) {
            const next = this.participants.values().next().value;
            if (next)
                next.role = 'host';
        }
        return true;
    }
    getState() {
        return {
            roomId: this.roomId,
            videoId: this.videoId,
            playing: this.playing,
            currentTime: this.currentTime,
            participants: Array.from(this.participants.values()).map(p => p.getState()),
        };
    }
    sync(playing, time) {
        this.playing = playing;
        this.currentTime = time;
        this.lastSyncTime = Date.now();
    }
    setVideo(videoId) {
        this.videoId = videoId;
        this.currentTime = 0;
        this.playing = false;
    }
    getParticipant(userId) {
        return this.participants.get(userId);
    }
    canControl(userId) {
        const p = this.participants.get(userId);
        return p ? (p.role === 'host' || p.role === 'moderator') : false;
    }
    isHost(userId) {
        const p = this.participants.get(userId);
        return p ? (p.role === 'host') : false;
    }
    assignRole(userId, role) {
        const p = this.participants.get(userId);
        if (p && p.role !== 'host') {
            p.role = role;
        }
    }
}
exports.Room = Room;
