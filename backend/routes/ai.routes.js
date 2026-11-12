import express from 'express';
import { suggestCode } from '../controllers/ai.controller.js';

export const aiRoutes = express.Router();

aiRoutes.post('/suggest', suggestCode);
