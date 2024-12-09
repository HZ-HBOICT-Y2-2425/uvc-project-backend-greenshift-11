import express from 'express';
import { authenticateToken } from '../middleware/exampleMiddleware.js';
import { addUser, loginUser } from '../controllers/exampleController.js';

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', loginUser);

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You accessed a protected route', user: req.user });
});

export default router;
