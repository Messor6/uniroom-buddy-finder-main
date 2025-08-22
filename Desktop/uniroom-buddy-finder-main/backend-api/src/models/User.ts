import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const jwt = require('jsonwebtoken');

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'student' | 'admin';
    university: string;
    course: string;
    graduationYear: number;
    age: number;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    bio?: string;
    interests: string[];
    lifestyle: {
        sleepSchedule: 'early-bird' | 'night-owl' | 'flexible';
        cleanliness: 'very-clean' | 'clean' | 'moderate' | 'relaxed';
        socialLevel: 'very-social' | 'social' | 'moderate' | 'private';
        studyHabits: 'very-quiet' | 'quiet' | 'moderate' | 'flexible';
        smokingDrinking: 'never' | 'occasionally' | 'regularly';
    };
    location: {
        city: string;
        state: string;
        country: string;
        preferredAreas?: string[];
    };
    budget: {
        min: number;
        max: number;
        currency: string;
    };
    preferences: {
        genderPreference: 'same' | 'different' | 'no-preference';
        ageRange: {
            min: number;
            max: number;
        };
        maxRoommates: number;
        petFriendly: boolean;
        smokingOk: boolean;
        drinkingOk: boolean;
    };
    isVerified: boolean;
    isActive: boolean;
    lastActive: Date;
    matchedUsers: mongoose.Types.ObjectId[];
    likedUsers: mongoose.Types.ObjectId[];
    dislikedUsers: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    getSignedJwtToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    university: {
        type: String,
        required: [true, 'Please provide your university']
    },
    course: {
        type: String,
        required: [true, 'Please provide your course']
    },
    graduationYear: {
        type: Number,
        required: [true, 'Please provide your graduation year']
    },
    age: {
        type: Number,
        required: [true, 'Please provide your age'],
        min: [18, 'You must be at least 18 years old']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        required: [true, 'Please specify your gender']
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    interests: [{
        type: String,
        trim: true
    }],
    lifestyle: {
        sleepSchedule: {
            type: String,
            enum: ['early-bird', 'night-owl', 'flexible'],
            required: true
        },
        cleanliness: {
            type: String,
            enum: ['very-clean', 'clean', 'moderate', 'relaxed'],
            required: true
        },
        socialLevel: {
            type: String,
            enum: ['very-social', 'social', 'moderate', 'private'],
            required: true
        },
        studyHabits: {
            type: String,
            enum: ['very-quiet', 'quiet', 'moderate', 'flexible'],
            required: true
        },
        smokingDrinking: {
            type: String,
            enum: ['never', 'occasionally', 'regularly'],
            required: true
        }
    },
    location: {
        city: {
            type: String,
            required: [true, 'Please provide your city']
        },
        state: {
            type: String,
            required: [true, 'Please provide your state']
        },
        country: {
            type: String,
            required: [true, 'Please provide your country']
        },
        preferredAreas: [{
            type: String
        }]
    },
    budget: {
        min: {
            type: Number,
            required: [true, 'Please provide minimum budget']
        },
        max: {
            type: Number,
            required: [true, 'Please provide maximum budget']
        },
        currency: {
            type: String,
            default: 'USD'
        }
    },
    preferences: {
        genderPreference: {
            type: String,
            enum: ['same', 'different', 'no-preference'],
            default: 'no-preference'
        },
        ageRange: {
            min: {
                type: Number,
                default: 18
            },
            max: {
                type: Number,
                default: 30
            }
        },
        maxRoommates: {
            type: Number,
            default: 3
        },
        petFriendly: {
            type: Boolean,
            default: false
        },
        smokingOk: {
            type: Boolean,
            default: false
        },
        drinkingOk: {
            type: Boolean,
            default: true
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    matchedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    
    return jwt.sign(
        { id: this._id.toString() }, 
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
