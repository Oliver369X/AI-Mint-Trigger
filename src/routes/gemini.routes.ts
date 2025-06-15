import express from 'express';
import { geminiTextController, geminiImageController } from '../controllers/gemini.controller';

const router = express.Router();

router.post('/gemini-text', geminiTextController);
router.post('/gemini-image', geminiImageController);

export default router; 