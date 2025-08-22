import { Router } from 'express';
import {
    getUsers,
    getUser,
    getPotentialMatches,
    likeUser,
    dislikeUser
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getUsers);
router.get('/matches', getPotentialMatches);
router.get('/:id', getUser);
router.post('/:id/like', likeUser);
router.post('/:id/dislike', dislikeUser);

export default router;
