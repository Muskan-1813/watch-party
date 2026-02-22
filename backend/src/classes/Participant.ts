import type { Role, ParticipantState } from '../types.js';

export class Participant {
    constructor(
        public readonly userId: string,
        public readonly username: string,
        public role: Role = 'participant'
    ) { }

    getState(): ParticipantState {
        return {
            userId: this.userId,
            username: this.username,
            role: this.role,
        };
    }
}
