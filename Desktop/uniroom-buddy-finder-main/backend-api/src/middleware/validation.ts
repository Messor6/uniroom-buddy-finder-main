import { body } from 'express-validator';

// Auth validation rules
export const registerValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('university')
        .trim()
        .notEmpty()
        .withMessage('University is required'),
    
    body('course')
        .trim()
        .notEmpty()
        .withMessage('Course is required'),
    
    body('graduationYear')
        .isInt({ min: new Date().getFullYear(), max: new Date().getFullYear() + 10 })
        .withMessage('Graduation year must be a valid future year'),
    
    body('age')
        .isInt({ min: 18, max: 100 })
        .withMessage('Age must be between 18 and 100'),
    
    body('gender')
        .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
        .withMessage('Please select a valid gender option'),
    
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    
    body('interests')
        .isArray({ min: 1 })
        .withMessage('Please provide at least one interest'),
    
    body('lifestyle.sleepSchedule')
        .isIn(['early-bird', 'night-owl', 'flexible'])
        .withMessage('Please select a valid sleep schedule'),
    
    body('lifestyle.cleanliness')
        .isIn(['very-clean', 'clean', 'moderate', 'relaxed'])
        .withMessage('Please select a valid cleanliness level'),
    
    body('lifestyle.socialLevel')
        .isIn(['very-social', 'social', 'moderate', 'private'])
        .withMessage('Please select a valid social level'),
    
    body('lifestyle.studyHabits')
        .isIn(['very-quiet', 'quiet', 'moderate', 'flexible'])
        .withMessage('Please select valid study habits'),
    
    body('lifestyle.smokingDrinking')
        .isIn(['never', 'occasionally', 'regularly'])
        .withMessage('Please select a valid smoking/drinking preference'),
    
    body('location.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    
    body('location.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    
    body('location.country')
        .trim()
        .notEmpty()
        .withMessage('Country is required'),
    
    body('budget.min')
        .isNumeric()
        .withMessage('Minimum budget must be a number'),
    
    body('budget.max')
        .isNumeric()
        .withMessage('Maximum budget must be a number')
        .custom((value, { req }) => {
            if (value <= req.body.budget.min) {
                throw new Error('Maximum budget must be greater than minimum budget');
            }
            return true;
        })
];

export const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Message validation
export const sendMessageValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Message content is required')
        .isLength({ max: 1000 })
        .withMessage('Message cannot exceed 1000 characters'),
    
    body('messageType')
        .optional()
        .isIn(['text', 'image', 'file'])
        .withMessage('Invalid message type')
];

// User update validation
export const updateUserValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    
    body('interests')
        .optional()
        .isArray()
        .withMessage('Interests must be an array'),
    
    body('lifestyle.sleepSchedule')
        .optional()
        .isIn(['early-bird', 'night-owl', 'flexible'])
        .withMessage('Please select a valid sleep schedule'),
    
    body('lifestyle.cleanliness')
        .optional()
        .isIn(['very-clean', 'clean', 'moderate', 'relaxed'])
        .withMessage('Please select a valid cleanliness level'),
    
    body('lifestyle.socialLevel')
        .optional()
        .isIn(['very-social', 'social', 'moderate', 'private'])
        .withMessage('Please select a valid social level'),
    
    body('lifestyle.studyHabits')
        .optional()
        .isIn(['very-quiet', 'quiet', 'moderate', 'flexible'])
        .withMessage('Please select valid study habits'),
    
    body('lifestyle.smokingDrinking')
        .optional()
        .isIn(['never', 'occasionally', 'regularly'])
        .withMessage('Please select a valid smoking/drinking preference'),
    
    body('budget.min')
        .optional()
        .isNumeric()
        .withMessage('Minimum budget must be a number'),
    
    body('budget.max')
        .optional()
        .isNumeric()
        .withMessage('Maximum budget must be a number')
        .custom((value, { req }) => {
            if (req.body.budget && req.body.budget.min && value <= req.body.budget.min) {
                throw new Error('Maximum budget must be greater than minimum budget');
            }
            return true;
        })
];
