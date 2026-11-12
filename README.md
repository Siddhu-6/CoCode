# CoCode – Real-Time Collaborative Code Editor

**Course:** Software Project Management (SPM), IIIT Vadodara
**Project topic:** Improving Team-Based Software Development Through Real-Time Code Collaboration
**Project link:** https://github.com/Siddhu-6/CoCode
**Live app:** https://cocode-zcgp.onrender.com

## Team

| Name | Roll No. |
|---|---|
| Shreyash Borkar | 202351132 |
| Soham Naukudkar | 202351135 |
| Siddhikesh Gavit | 202351040 |
| Akshay Telkhede | 202351004 |

## About the project

When a team works on code together, most of the friction is not in the code itself. It is in passing files around, waiting for someone to push, merging copies that drifted apart, and switching between an editor, a chat app and a terminal just to show someone a bug.

CoCode puts all of that in one browser tab. A user creates a room, shares the Room ID, and everyone who joins sees the same files, the same edits as they happen, and the same chat. Code can be run from the same screen, so the team checks output together instead of each person running it locally.

## Features

- **Rooms** – create a room (UUID-based Room ID) or join one with an ID; joined rooms are listed on your dashboard
- **Live code sync** – edits are broadcast to everyone in the room through Socket.IO, scoped to the file currently open
- **Shared files per room** – create, upload (`.js`, `.py`, `.c`, `.cpp`), open, download and delete files; content is stored in MongoDB
- **Auto-save** – every change to an open file is written back to the database
- **Room chat** – messages are stored per room, so people who join late see the earlier conversation
- **Run code** – JavaScript, Python, C and C++ can be executed from the editor, with output shown in the console panel
- **AI suggestion** – the backend sends the current code and language to Groq (GPT-OSS 120B) and puts the completed code back in the editor
- **Accounts** – sign up / log in with hashed passwords (bcrypt) and JWT tokens; editor and room pages are protected routes
- **Collaborator list** – shows who has joined the room

## Tech stack

**Frontend**
- React 18 + Vite
- Monaco Editor (`@monaco-editor/react`)
- Tailwind CSS, shadcn/ui, Framer Motion
- Axios, Socket.IO client, React Router

**Backend**
- Node.js + Express 5
- Socket.IO
- MongoDB with Mongoose
- bcryptjs, jsonwebtoken
- `child_process` for compiling/running Python, C and C++; Node `vm` for JavaScript

**AI**
- Groq API, model `openai/gpt-oss-120b` (called from the backend)

## Project structure

```text
backend/
  config/         database connection
  controllers/    auth, rooms, files, code execution
  modules/        Mongoose models: User, Room, File, Message
  routes/         /auth, /rooms, /code
  socket/         Socket.IO events (joinRoom, codeUpdate, send_message)
  server.js

frontend/src/
  api/            axios client, socket client
  services/       auth, room, file, code, ai, token
  hooks/          useAuth, useCurrentUser, useRooms, useSocketRoom
  Pages/          Home, JoinRoom, CodeEditor
  components/     Sidebar, Code (Monaco), Output, Navbar, ui/
  app/router.jsx
```

## Running locally

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas), Git. For running code you also need `python`, `gcc` and `g++` available on the machine running the backend.

```bash
git clone https://github.com/Siddhu-6/CoCode.git
cd CoCode
```

**Backend**

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_KEY=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Leave `VITE_API_URL` empty for local use: the Vite dev server proxies `/api` (REST and Socket.IO) to `http://localhost:3000`.

## Deployment

The whole app runs as one Render web service. The root `Dockerfile` builds the React frontend, copies it into the backend, and the Express server serves both the app and the API from the same URL. It also installs `python3`, `gcc` and `g++` so code execution works on the server.

1. Create a free MongoDB Atlas cluster, allow network access from `0.0.0.0/0`, and copy the connection string.
2. On Render: **New → Blueprint**, pick this repository. `render.yaml` sets up the service.
3. Enter `MONGO_URI` and `GROQ_API_KEY` when asked (`JWT_KEY` is generated), then **Apply**.

Health check: `/health`. On the free plan the service sleeps after 15 minutes without traffic, so the first request after that can take up to a minute.

## Known limitations

- Code sync sends the whole file on every change, so if two people type at the exact same moment the last update wins. There is no OT/CRDT merge yet.
- Auto-save calls the API on every keystroke (no debounce).
- Code execution is not sandboxed for Python/C/C++, uses fixed temp file names, and has no stdin support.
- Socket.IO rooms live in one server's memory, so running more than one server instance would need a Redis adapter.
- The auth middleware is not yet applied to the room/file routes.

## Future scope

- Conflict-free editing with Yjs (CRDT) and live cursors per user
- Run code inside Docker containers with time/memory limits and stdin input
- Rate limits on AI and Run requests; Redis adapter to scale beyond one server
- Role-based access in rooms (owner / editor / viewer)
- Git integration, version history and voice/video in rooms
