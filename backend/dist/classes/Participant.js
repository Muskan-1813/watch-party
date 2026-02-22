"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participant = void 0;
class Participant {
    constructor(userId, username, role = 'participant') {
        this.userId = userId;
        this.username = username;
        this.role = role;
    }
    getState() {
        return {
            userId: this.userId,
            username: this.username,
            role: this.role,
        };
    }
}
exports.Participant = Participant;
