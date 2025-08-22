import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
    users: mongoose.Types.ObjectId[];
    status: 'pending' | 'matched' | 'declined';
    initiatedBy: mongoose.Types.ObjectId;
    matchedAt?: Date;
    compatibility: {
        score: number;
        factors: {
            lifestyle: number;
            interests: number;
            budget: number;
            location: number;
            preferences: number;
        };
    };
    lastMessage?: {
        sender: mongoose.Types.ObjectId;
        content: string;
        timestamp: Date;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MatchSchema: Schema = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    status: {
        type: String,
        enum: ['pending', 'matched', 'declined'],
        default: 'pending'
    },
    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchedAt: {
        type: Date
    },
    compatibility: {
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        factors: {
            lifestyle: {
                type: Number,
                min: 0,
                max: 100
            },
            interests: {
                type: Number,
                min: 0,
                max: 100
            },
            budget: {
                type: Number,
                min: 0,
                max: 100
            },
            location: {
                type: Number,
                min: 0,
                max: 100
            },
            preferences: {
                type: Number,
                min: 0,
                max: 100
            }
        }
    },
    lastMessage: {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            maxlength: 1000
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
MatchSchema.index({ users: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ 'compatibility.score': -1 });

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
