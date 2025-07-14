import {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get
} from '../controllers/authController.js';
import Router from 'express'
import { predictMove } from '../api/MLController_temp.js';
import { saveMatch } from '../api/MatchController.js'; 
import { getPlayerDetails } from '../models/PlayerController.js';
import { getTopScores, getUserProfile } from '../api/TopScores.js';
const router = Router();

router.get('/signup', signup_get);
router.post('/signup', signup_post);
router.get('/login', login_get);
router.post('/login', login_post);
router.get('/logout', logout_get);
router.post('/save', saveMatch); 
router.get('/player/:userId', getPlayerDetails);
router.post('/predict', predictMove);
router.get("/top-scores", getTopScores);
router.get("/profile/:userId", getUserProfile);
export default router;
