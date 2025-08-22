import { Router } from 'express';
import {
    getMatches,
    getMatch,
    updateMatch,
    getMatchStats
} from '../controllers/matchController';
import { protect } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', getMatches);
router.get('/stats', getMatchStats);
router.get('/:id', getMatch);
router.put('/:id', updateMatch);

export default router;
