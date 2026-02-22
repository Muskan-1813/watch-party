# 🍿 YouTube Watch Party - User Guide

Welcome to the **YouTube Watch Party** system! This guide is designed to explain how this application works in simple, everyday language. You don't need to be a computer expert to understand how we've built your new digital cinema.

---

## 🌟 What is this?
Think of this app as a **"Digital Living Room"**. Usually, when you watch a YouTube video, you're on your own. If you want to watch with a friend, you have to count "3, 2, 1, Play!" and hope you're in sync. 

This application does that for you automatically. When you join a "Room," everyone sees the exact same thing at the exact same time.

---

## 🚀 How to Use It

### 1. Joining the Party
When you open the app, you'll see a simple box asking for:
*   **Your Name:** So your friends know who you are.
*   **Room Code:** A secret code for your specific "Living Room." 
    *   If you're starting a new party, you can click **"New"** to get a random code.
    *   If your friend invited you, just paste their code here.

### 2. The Main Screen
Once you join, you'll see:
*   **The Video Player:** In the center, where the movie plays.
*   **Participant List:** On the right, showing everyone currently in the room.
*   **Video Changer:** (For Hosts/Moderators) A box at the bottom to paste a new YouTube link.

---

## 🎭 The "Roles" (Who's the Boss?)
Every room has different levels of control to keep things organized:

| Role | Who are they? | What can they do? |
| :--- | :--- | :--- |
| **Host** 👑 | The person who created the room. | Full control. They can play, pause, seek, change the video, kick people out, or give others more power. |
| **Moderator** 🛡️ | A trusted friend chosen by the Host. | Can play, pause, seek, and change the video. |
| **Participant** 👋 | Everyone else who joins. | They are here to watch and enjoy! They cannot change the video or pause it for everyone else. |

---

## 🪄 How the "Magic" Works (The Technical Part, Simplified)

### 1. The "Live Connection" (WebSockets)
Imagine everyone in the room has a **walkie-talkie** that is always "ON." 
In technical terms, we use something called **WebSockets**. Instead of your computer constantly asking "Did someone pause?", the server **shouts** to everyone: "HEY! The Host just paused. You pause too!" 

### 2. The "Brain" (The Backend)
The "Brain" is a program running on a server that keeps a list of every room. It remembers:
*   What video is playing.
*   If it's currently playing or paused.
*   Where exactly in the video we are (the timestamp).
*   Who is in the room and what their role is.

### 3. Synchronization (Staying Together)
If your internet is a bit slow and you fall behind by more than 2 seconds, the "Brain" notices and tells your player to **"Jump Ahead"** to the correct spot. This ensures everyone sees the punchline of a joke or the jump-scare in a horror movie at the exact same time.

---

## 🛠️ Summary of Features
*   **Real-Time Sync:** Play/Pause/Seek happens for everyone instantly.
*   **Room Codes:** Private spaces for you and your friends.
*   **Role Management:** The Host can promote people to Moderators or remove troublemakers.
*   **YouTube Integration:** Just paste any YouTube link and the whole party switches to that video.

---

**Happy Watching!** 🎬
