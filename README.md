# 📺 YouTube Watch Party

A real-time, synchronized YouTube player built with React, Node.js, and WebSockets. Watch videos together with friends, synchronized down to the second.

## 🚀 Features
- **Real-time Sync**: Play, pause, and seek actions are broadcast instantly to all room participants.
- **Room-based Architecture**: Create or join specific rooms with unique codes.
- **Role-Based Access (RBAC)**:
  - **Host**: Full control over playback, roles, and participants.
  - **Moderator**: Can control playback and change videos.
  - **Participant/Viewer**: Watch-only access.
- **Auto-Sync**: Automatically catches up users who fall behind due to network lag.
- **Premium UI**: Modern dark-mode design with glassmorphism and smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Socket.IO Client, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, Socket.IO, TypeScript.
- **Real-time**: WebSocket (Socket.IO) for bi-directional communication.

## 📖 Documentation
- For a **non-technical explanation** of how this works, see [DOCUMENTATION.md](./DOCUMENTATION.md).
- For the **Technical Walkthrough**, see the project artifacts.

## 💻 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Muskan-1813/watch-party.git
cd watch-party
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:3001`.

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🌐 Deployment
This application is deployed and live at the following URL:
- **Live URL**: [https://watch-party-sandy.vercel.app](https://watch-party-sandy.vercel.app)

## 🏗️ Architecture Overview
The system uses a **Centralized State Model** managed by the backend. 
1. When a user joins a room, they connect via **Socket.IO**.
2. Actions like `play` or `seek` are sent to the server.
3. The server validates the user's **Role**.
4. If authorized, the server updates the room state and **broadcasts** the update to all other connected clients in that room.
5. The frontend uses the **YouTube IFrame API** to programmatically control the video player based on these broadcasts.

---
Built with ❤️ for the Intern Assignment.
