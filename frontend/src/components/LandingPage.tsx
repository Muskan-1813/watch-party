import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

interface LandingPageProps {
    onJoin: (roomId: string, username: string) => void;
}

export const LandingPage = ({ onJoin }: LandingPageProps) => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && roomId) {
            setLoading(true);
            onJoin(roomId, username);
        }
    };

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 9);
        setRoomId(newRoomId);
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--primary-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 20px var(--primary-glow)' }}>
                        <Play fill="white" size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>YouTube Party</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Watch videos together in real-time</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>YOUR NAME</label>
                        <input
                            className="input"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>ROOM CODE</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                className="input"
                                placeholder="Enter room code"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={createRoom}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                New
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px', justifyContent: 'center', height: '48px' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Join Party'}
                    </button>
                </form>
            </div>
        </div>
    );
};
