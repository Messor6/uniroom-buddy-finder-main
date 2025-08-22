import { Request, Response, NextFunction } from 'express';
import { Match } from '../models/Match';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user's matches
// @route   GET /api/matches
// @access  Private
export const getMatches = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const matches = await Match.find({
        users: req.user.id,
        status: 'matched',
        isActive: true
    })
    .populate({
        path: 'users',
        select: 'name avatar university course age location bio interests',
        match: { _id: { $ne: req.user.id } }
    })
    .sort({ 'lastMessage.timestamp': -1, updatedAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Match.countDocuments({
        users: req.user.id,
        status: 'matched',
        isActive: true
    });

    res.status(200).json({
        success: true,
        count: matches.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: matches
    });
});

// @desc    Get single match
// @route   GET /api/matches/:id
// @access  Private
export const getMatch = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const match = await Match.findOne({
        _id: req.params.id,
        users: req.user.id
    }).populate({
        path: 'users',
        select: 'name avatar university course age location bio interests lifestyle preferences'
    });

    if (!match) {
        throw createError('Match not found', 404);
    }

    res.status(200).json({
        success: true,
        data: match
    });
});

// @desc    Update match (decline/unmatch)
// @route   PUT /api/matches/:id
// @access  Private
export const updateMatch = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { action } = req.body;

    if (!['decline', 'unmatch'].includes(action)) {
        throw createError('Invalid action. Use "decline" or "unmatch"', 400);
    }

    const match = await Match.findOne({
        _id: req.params.id,
        users: req.user.id
    });

    if (!match) {
        throw createError('Match not found', 404);
    }

    if (action === 'decline') {
        match.status = 'declined';
    } else if (action === 'unmatch') {
        match.isActive = false;
    }

    await match.save();

    // Remove from matched users in User documents
    if (action === 'unmatch') {
        const otherUserId = match.users.find(userId => userId.toString() !== req.user.id);
        
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { matchedUsers: otherUserId }
        });
        
        await User.findByIdAndUpdate(otherUserId, {
            $pull: { matchedUsers: req.user.id }
        });
    }

    res.status(200).json({
        success: true,
        message: action === 'decline' ? 'Match declined' : 'Match removed',
        data: match
    });
});

// @desc    Get match statistics
// @route   GET /api/matches/stats
// @access  Private
export const getMatchStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);
    
    if (!user) {
        throw createError('User not found', 404);
    }

    const totalMatches = await Match.countDocuments({
        users: req.user.id,
        status: 'matched',
        isActive: true
    });

    const pendingMatches = await Match.countDocuments({
        users: req.user.id,
        status: 'pending'
    });

    const totalLikes = user.likedUsers.length;
    const totalDislikes = user.dislikedUsers.length;

    // Get recent messages count
    const recentMessages = await Message.countDocuments({
        receiver: req.user.id,
        isRead: false,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    // Get compatibility distribution
    const compatibilityStats = await Match.aggregate([
        {
            $match: {
                users: req.user.id,
                status: 'matched',
                isActive: true
            }
        },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $gte: ['$compatibility.score', 80] },
                        then: 'high',
                        else: {
                            $cond: {
                                if: { $gte: ['$compatibility.score', 60] },
                                then: 'medium',
                                else: 'low'
                            }
                        }
                    }
                },
                count: { $sum: 1 }
            }
        }
    ]);

    const compatibility = {
        high: 0,
        medium: 0,
        low: 0
    };

    compatibilityStats.forEach(stat => {
        compatibility[stat._id as keyof typeof compatibility] = stat.count;
    });

    res.status(200).json({
        success: true,
        data: {
            totalMatches,
            pendingMatches,
            totalLikes,
            totalDislikes,
            recentMessages,
            compatibility,
            profileViews: 0, // Placeholder for future implementation
            likesReceived: 0 // Placeholder for future implementation
        }
    });
});
