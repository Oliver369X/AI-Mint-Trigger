import express from 'express';
import { prepareMintController } from '../controllers/mint.controller';

const router = express.Router();

router.post('/prepare-mint', prepareMintController);

export default router; 