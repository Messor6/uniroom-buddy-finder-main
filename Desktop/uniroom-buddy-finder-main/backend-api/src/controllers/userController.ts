import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { Match } from '../models/Match';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all users with filtering and pagination
// @route   GET /api/users
// @access  Private
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { 
        _id: { $ne: req.user.id }, // Exclude current user
        isActive: true 
    };

    // Apply filters based on query parameters
    if (req.query.university) {
        filter.university = new RegExp(req.query.university as string, 'i');
    }

    if (req.query.course) {
        filter.course = new RegExp(req.query.course as string, 'i');
    }

    if (req.query.city) {
        filter['location.city'] = new RegExp(req.query.city as string, 'i');
    }

    if (req.query.gender) {
        filter.gender = req.query.gender;
    }

    if (req.query.minAge || req.query.maxAge) {
        filter.age = {};
        if (req.query.minAge) filter.age.$gte = parseInt(req.query.minAge as string);
        if (req.query.maxAge) filter.age.$lte = parseInt(req.query.maxAge as string);
    }

    if (req.query.minBudget || req.query.maxBudget) {
        if (req.query.minBudget) filter['budget.min'] = { $lte: parseInt(req.query.minBudget as string) };
        if (req.query.maxBudget) filter['budget.max'] = { $gte: parseInt(req.query.maxBudget as string) };
    }

    // Get current user's already interacted users
    const currentUser = await User.findById(req.user.id);
    const excludeUsers = [
        ...currentUser!.likedUsers,
        ...currentUser!.dislikedUsers,
        ...currentUser!.matchedUsers
    ];

    filter._id = { $ne: req.user.id, $nin: excludeUsers };

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
        .select('-password -likedUsers -dislikedUsers -matchedUsers')
        .skip(skip)
        .limit(limit)
        .sort({ lastActive: -1 });

    res.status(200).json({
        success: true,
        count: users.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: users
    });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).select('-password -likedUsers -dislikedUsers');

    if (!user) {
        throw createError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Get potential matches for current user
// @route   GET /api/users/matches
// @access  Private
export const getPotentialMatches = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
        throw createError('User not found', 404);
    }

    // Get users that haven't been liked, disliked, or matched
    const excludeUsers = [
        ...currentUser.likedUsers,
        ...currentUser.dislikedUsers,
        ...currentUser.matchedUsers,
        currentUser._id
    ];

    const filter: any = {
        _id: { $nin: excludeUsers },
        isActive: true
    };

    // Apply user preferences
    if (currentUser.preferences.genderPreference !== 'no-preference') {
        if (currentUser.preferences.genderPreference === 'same') {
            filter.gender = currentUser.gender;
        } else if (currentUser.preferences.genderPreference === 'different') {
            filter.gender = { $ne: currentUser.gender };
        }
    }

    // Age range filter
    filter.age = {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
    };

    // Location filter (same city for now)
    filter['location.city'] = currentUser.location.city;

    // Budget compatibility
    filter.$or = [
        {
            'budget.min': { $lte: currentUser.budget.max },
            'budget.max': { $gte: currentUser.budget.min }
        }
    ];

    const potentialMatches = await User.find(filter)
        .select('-password -likedUsers -dislikedUsers -matchedUsers')
        .limit(10)
        .sort({ lastActive: -1 });

    // Calculate compatibility scores
    const matchesWithScores = potentialMatches.map(match => {
        const score = calculateCompatibilityScore(currentUser, match);
        return {
            ...match.toObject(),
            compatibilityScore: score
        };
    });

    // Sort by compatibility score
    matchesWithScores.sort((a: any, b: any) => (b.compatibilityScore as number) - (a.compatibilityScore as number));

    res.status(200).json({
        success: true,
        count: matchesWithScores.length,
        data: matchesWithScores
    });
});

// @desc    Like a user
// @route   POST /api/users/:id/like
// @access  Private
export const likeUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
        throw createError('You cannot like yourself', 400);
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        throw createError('User not found', 404);
    }

    const currentUser = await User.findById(currentUserId);
    
    // Convert string to ObjectId for comparison
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    
    // Check if already liked
    if (currentUser!.likedUsers.includes(targetObjectId)) {
        throw createError('You have already liked this user', 400);
    }

    // Add to liked users
    currentUser!.likedUsers.push(targetObjectId);
    await currentUser!.save();

    // Check if it's a match (mutual like)
    let isMatch = false;
    let match = null;

    const currentObjectId = new mongoose.Types.ObjectId(currentUserId);
    if (targetUser.likedUsers.includes(currentObjectId)) {
        isMatch = true;
        
        // Create match
        const compatibilityScore = calculateCompatibilityScore(currentUser!, targetUser);
        
        match = await Match.create({
            users: [currentUserId, targetUserId],
            status: 'matched',
            initiatedBy: currentUserId,
            matchedAt: new Date(),
            compatibility: compatibilityScore
        });

        // Add to matched users
        currentUser!.matchedUsers.push(targetObjectId);
        targetUser.matchedUsers.push(currentObjectId);
        
        await currentUser!.save();
        await targetUser.save();
    }

    res.status(200).json({
        success: true,
        message: isMatch ? 'It\'s a match!' : 'User liked successfully',
        isMatch,
        match: match ? match._id : null
    });
});

// @desc    Dislike a user
// @route   POST /api/users/:id/dislike
// @access  Private
export const dislikeUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
        throw createError('You cannot dislike yourself', 400);
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
        throw createError('User not found', 404);
    }

    const currentUser = await User.findById(currentUserId);
    
    // Convert string to ObjectId for comparison
    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    
    // Check if already disliked
    if (currentUser!.dislikedUsers.includes(targetObjectId)) {
        throw createError('You have already disliked this user', 400);
    }

    // Add to disliked users
    currentUser!.dislikedUsers.push(targetObjectId);
    await currentUser!.save();

    res.status(200).json({
        success: true,
        message: 'User disliked successfully'
    });
});

// Helper function to calculate compatibility score
function calculateCompatibilityScore(user1: any, user2: any) {
    let totalScore = 0;
    const factors = {
        lifestyle: 0,
        interests: 0,
        budget: 0,
        location: 0,
        preferences: 0
    };

    // Lifestyle compatibility (30%)
    const lifestyleFactors = ['sleepSchedule', 'cleanliness', 'socialLevel', 'studyHabits', 'smokingDrinking'];
    let lifestyleMatches = 0;
    lifestyleFactors.forEach(factor => {
        if (user1.lifestyle[factor] === user2.lifestyle[factor]) {
            lifestyleMatches++;
        }
    });
    factors.lifestyle = (lifestyleMatches / lifestyleFactors.length) * 100;

    // Interest compatibility (20%)
    const commonInterests = user1.interests.filter((interest: string) => 
        user2.interests.includes(interest)
    );
    factors.interests = commonInterests.length > 0 ? 
        (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * 100 : 0;

    // Budget compatibility (20%)
    const budgetOverlap = Math.max(0, 
        Math.min(user1.budget.max, user2.budget.max) - Math.max(user1.budget.min, user2.budget.min)
    );
    const budgetRange = Math.max(user1.budget.max, user2.budget.max) - Math.min(user1.budget.min, user2.budget.min);
    factors.budget = budgetRange > 0 ? (budgetOverlap / budgetRange) * 100 : 0;

    // Location compatibility (15%)
    factors.location = user1.location.city === user2.location.city ? 100 : 0;

    // Preference compatibility (15%)
    let preferenceScore = 0;
    
    // Age preference
    if (user1.age >= user2.preferences.ageRange.min && user1.age <= user2.preferences.ageRange.max &&
        user2.age >= user1.preferences.ageRange.min && user2.age <= user1.preferences.ageRange.max) {
        preferenceScore += 50;
    }
    
    // Gender preference
    if ((user1.preferences.genderPreference === 'no-preference' || 
         (user1.preferences.genderPreference === 'same' && user1.gender === user2.gender) ||
         (user1.preferences.genderPreference === 'different' && user1.gender !== user2.gender)) &&
        (user2.preferences.genderPreference === 'no-preference' || 
         (user2.preferences.genderPreference === 'same' && user2.gender === user1.gender) ||
         (user2.preferences.genderPreference === 'different' && user2.gender !== user1.gender))) {
        preferenceScore += 50;
    }
    
    factors.preferences = preferenceScore;

    // Calculate weighted total score
    totalScore = (
        factors.lifestyle * 0.3 +
        factors.interests * 0.2 +
        factors.budget * 0.2 +
        factors.location * 0.15 +
        factors.preferences * 0.15
    );

    return {
        score: Math.round(totalScore),
        factors
    };
}
