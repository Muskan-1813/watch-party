export type Role = 'host' | 'moderator' | 'participant' | 'viewer';

export interface ParticipantState {
    userId: string;
    username: string;
    role: Role;
}

export interface RoomState {
    roomId: string;
    videoId: string;
    playing: boolean;
    currentTime: number;
    participants: ParticipantState[];
}
