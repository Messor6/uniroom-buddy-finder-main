import multer from 'multer';
import path from 'path';
import { createError } from './errorHandler';

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = process.env.UPLOAD_PATH || 'uploads/';
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    if (file.fieldname === 'avatar') {
        // Only allow images for avatar
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(createError('Only image files are allowed for avatar', 400));
        }
    } else if (file.fieldname === 'messageFile') {
        // Allow images and documents for messages
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(createError('File type not allowed', 400));
        }
    } else {
        cb(createError('Unexpected field', 400));
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5000000'), // 5MB default
        files: 1
    }
});

// Export different upload configurations
export const uploadAvatar = upload.single('avatar');
export const uploadMessageFile = upload.single('messageFile');

// Error handling middleware for multer
export const handleMulterError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'File too large'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: 'Too many files'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                error: 'Unexpected field'
            });
        }
    }
    
    next(error);
};
