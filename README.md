🎬 Watch Party

A real-time Watch Party application built with TypeScript, featuring a WebSocket-powered backend and a modern frontend client.

Users can create rooms, join friends, and watch content together in sync.

📁 Project Structure
watch-party/
  ├── server/
  │     ├── src/
  │     │     ├── index.ts
  │     │     ├── RoomManager.ts
  │     │     ├── types.ts
  │     ├── package.json
  │     └── tsconfig.json
  │
  ├── client/
  │     ├── src/
  │     │     ├── main.tsx
  │     │     ├── App.tsx
  │     │     ├── pages/
  │     │     ├── components/
  │     ├── package.json
  │
  └── README.md
🚀 Features

🏠 Create & Join Rooms

🔄 Real-time video sync (Play / Pause / Seek)

👥 Multiple participants per room

⚡ WebSocket-based communication

🧠 Centralized room state management

🛠️ Tech Stack
Backend (Server)

Node.js

TypeScript

WebSocket (ws)

Frontend (Client)

React

TypeScript

Vite

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone <your-repo-url>
cd watch-party
2️⃣ Setup Server
cd server
npm install
npm run dev

Server will start on:

http://localhost:3000
3️⃣ Setup Client

Open a new terminal:

cd client
npm install
npm run dev

Client will start on:

http://localhost:5173
🧩 How It Works

RoomManager.ts
Handles creation, deletion, and synchronization of rooms.

index.ts
Initializes the WebSocket server and handles connections.

types.ts
Defines shared TypeScript interfaces and message types.

client/
Handles UI, WebSocket connection, and event emission.

📡 WebSocket Events (Example)
// Client -> Server
CREATE_ROOM
JOIN_ROOM
PLAY
PAUSE
SEEK

// Server -> Clients
ROOM_CREATED
ROOM_JOINED
SYNC_STATE
🧪 Future Improvements

🎥 Video URL input support

💬 Real-time chat

🔐 Authentication

🌍 Deployment (Render / Railway / Vercel)

📱 Responsive UI

📜 License

MIT License
