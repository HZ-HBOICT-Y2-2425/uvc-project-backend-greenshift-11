import express from 'express';
import { authenticateToken } from '../middleware/exampleMiddleware.js';
import { addUser, loginUser, getUsers, addNote, getNotes, updateUserCategories, proxyUpdateTasksByCategory,} from '../controllers/exampleController.js';

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', loginUser);
router.get('/users', getUsers);
router.post('/notes', addNote);
router.get('/notes/:user', getNotes);
router.put("/users/categories", updateUserCategories);
router.put('/tasks/:category', proxyUpdateTasksByCategory);


router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You accessed a protected route', user: req.user });
});


router.post("/validate-token", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Token is valid" }); // Send success if token is valid
  });

export default router;

