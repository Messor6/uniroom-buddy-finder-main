import { Router } from 'express';
import {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import {
    registerValidation,
    loginValidation,
    updatePasswordValidation,
    updateUserValidation
} from '../middleware/validation';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateUserValidation, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, updatePassword);

export default router;
