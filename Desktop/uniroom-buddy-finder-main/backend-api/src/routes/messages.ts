import { Router } from 'express';
import {
    getMessages,
    sendMessage,
    markMessageAsRead,
    getUnreadCount,
    deleteMessage
} from '../controllers/messageController';
import { protect } from '../middleware/auth';
import { sendMessageValidation } from '../middleware/validation';

const router = Router();

// All routes are protected
router.use(protect);

// Message routes
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markMessageAsRead);
router.delete('/:id', deleteMessage);

// Match message routes
router.get('/matches/:matchId/messages', getMessages);
router.post('/matches/:matchId/messages', sendMessageValidation, sendMessage);

export default router;
