// routes\auth.js

import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { register, login, logout, me } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);  // changed from GET to POST
router.get('/me', authMiddleware, me);

export default router;
