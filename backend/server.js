import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import connectDB from './config/connectToDatabase.js';
import { aiRoutes } from './routes/ai.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { codeRoutes } from './routes/code.routes.js';
import { roomRoutes } from './routes/room.routes.js';
import { initSocket } from './socket/socketIO.js';

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

app.use(express.json());

const corsOption = {
  origin: "*",
  // credentials: true,
};

app.use(cors(corsOption));
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/code', codeRoutes);
app.use('/ai', aiRoutes);
app.get('/health', (req, res) => res.send('ok'));

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

initSocket(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is Running on the PORT ${PORT}`);
})