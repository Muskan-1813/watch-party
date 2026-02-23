import { Users, Shield, User, LogOut, UserPlus } from "lucide-react";
import type { ParticipantState, Role } from "../types";

interface ParticipantListProps {
  participants: ParticipantState[];
  currentUserId: string | null;
  isHost: boolean;
  onAssignRole: (userId: string, role: Role) => void;
  onRemove: (userId: string) => void;
}

export const ParticipantList = ({
  participants,
  currentUserId,
  isHost,
  onAssignRole,
  onRemove,
}: ParticipantListProps) => {
  return (
    <div
      className="glass"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          padding: "20px",
          maxWidth: "1400px",
          margin: "0 auto",
          borderBottom: "1px solid var(--glass-border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Users size={20} color="var(--primary-color)" />
        <h3 style={{ fontSize: "18px", fontWeight: "600" }}>Participants</h3>
        <span
          style={{
            marginLeft: "auto",
            background: "var(--glass-bg)",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "12px",
          }}
        >
          {participants.length}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {participants.map((p) => (
          <div
            key={p.userId}
            className="glass"
            style={{
              marginBottom: "8px",
              padding: "12px",
              flexWrap: "wrap",
              border:
                p.userId === currentUserId
                  ? "1px solid var(--primary-color)"
                  : "1px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--glass-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.role === "host" ? (
                <Shield size={16} color="#f59e0b" />
              ) : (
                <User size={16} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontWeight: "600", fontSize: "14px" }}>
                  {p.username}
                </span>
                {p.userId === currentUserId && (
                  <span
                    style={{ fontSize: "10px", color: "var(--primary-color)" }}
                  >
                    (You)
                  </span>
                )}
              </div>
              <span className={`badge badge-${p.role}`}>{p.role}</span>
            </div>

            {isHost && p.userId !== currentUserId && (
              <div style={{ display: "flex", gap: "4px" }}>
                {p.role === "participant" ? (
                  <button
                    onClick={() => onAssignRole(p.userId, "moderator")}
                    className="btn btn-secondary"
                    style={{ padding: "4px" }}
                    title="Promote to Moderator"
                  >
                    <UserPlus size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => onAssignRole(p.userId, "participant")}
                    className="btn btn-secondary"
                    style={{ padding: "4px" }}
                    title="Demote to Participant"
                  >
                    <User size={14} />
                  </button>
                )}
                <button
                  onClick={() => onRemove(p.userId)}
                  className="btn btn-secondary"
                  style={{ padding: "4px", color: "var(--danger-color)" }}
                  title="Remove Participant"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
