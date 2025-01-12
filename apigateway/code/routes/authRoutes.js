import express from 'express';
import { authenticateToken } from '../middleware/exampleMiddleware.js';
import { 
  addUser, 
  loginUser, 
  getUsers, 
  addNote, 
  getNotes,
  getInventory,  // Add these
  purchaseItem,  // new 
  getCurrency,    // imports
  getItems,  // new
  updateCompletedTasks,
  updateUserCoins,
    getUserDetails,
    getStreakCount,
     updateUser,
     getLeaderboard, } from '../controllers/exampleController.js';

const router = express.Router();

router.post('/signup', addUser);
router.post('/login', loginUser);
router.get('/users', getUsers);
router.get('/users/:identifier', getUserDetails);
router.post('/notes', addNote);
router.get('/notes/:user', getNotes);
router.get('/currency/:user', authenticateToken, getCurrency);
router.get('/inventory/:user', authenticateToken, getInventory);
router.post('/purchase', authenticateToken, purchaseItem);
router.get('/items', getItems);
router.get('/leaderboard', getLeaderboard);


router.get('/users/:identifier', getUserDetails);
router.put('/users/:identifier', updateUser);
router.put('/completed-tasks', updateCompletedTasks);
router.put('/:user/update-coins', updateUserCoins);
router.get('/streak/:user', getStreakCount);

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You accessed a protected route', user: req.user });
});


router.post("/validate-token", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Token is valid" }); // Send success if token is valid
  });

export default router;