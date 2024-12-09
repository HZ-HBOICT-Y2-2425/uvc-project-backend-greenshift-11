import express from 'express';
import { authenticateToken } from '../middleware/exampleMiddleware.js';
import { addUser, loginUser, getUsers } from '../controllers/exampleController.js';

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', loginUser);
router.get('/users', getUsers);

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You accessed a protected route', user: req.user });
});

router.post('/validate-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).json({ valid: true, user });
    } catch (err) {
      res.status(403).json({ message: 'Invalid token' });
    }
  });

export default router;
