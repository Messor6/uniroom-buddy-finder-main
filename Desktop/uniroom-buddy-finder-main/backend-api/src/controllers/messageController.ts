import { Request, Response, NextFunction } from 'express';
import { Message } from '../models/Message';
import { Match } from '../models/Match';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { io } from '../apps';

// @desc    Get messages for a match
// @route   GET /api/matches/:matchId/messages
// @access  Private
export const getMessages = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { matchId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Verify user is part of this match
    const match = await Match.findOne({
        _id: matchId,
        users: req.user.id,
        status: 'matched'
    });

    if (!match) {
        throw createError('Match not found or unauthorized', 404);
    }

    const messages = await Message.find({ match: matchId })
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Message.countDocuments({ match: matchId });

    // Mark messages as read
    await Message.updateMany(
        {
            match: matchId,
            receiver: req.user.id,
            isRead: false
        },
        {
            isRead: true,
            readAt: new Date()
        }
    );

    res.status(200).json({
        success: true,
        count: messages.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: messages.reverse() // Reverse to show oldest first
    });
});

// @desc    Send a message
// @route   POST /api/matches/:matchId/messages
// @access  Private
export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { matchId } = req.params;
    const { content, messageType = 'text' } = req.body;

    if (!content || content.trim() === '') {
        throw createError('Message content is required', 400);
    }

    // Verify user is part of this match
    const match = await Match.findOne({
        _id: matchId,
        users: req.user.id,
        status: 'matched',
        isActive: true
    });

    if (!match) {
        throw createError('Match not found or unauthorized', 404);
    }

    // Get receiver ID
    const receiverId = match.users.find(userId => userId.toString() !== req.user.id);

    if (!receiverId) {
        throw createError('Receiver not found', 404);
    }

    // Create message
    const message = await Message.create({
        match: matchId,
        sender: req.user.id,
        receiver: receiverId,
        content: content.trim(),
        messageType,
        isDelivered: true,
        deliveredAt: new Date()
    });

    // Populate sender and receiver info
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    // Update match with last message
    match.lastMessage = {
        sender: req.user.id,
        content: content.trim(),
        timestamp: new Date()
    };
    await match.save();

    // Emit message to receiver via Socket.IO
    io.to(`user_${receiverId}`).emit('new-message', {
        matchId,
        message: message.toObject()
    });

    res.status(201).json({
        success: true,
        data: message
    });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markMessageAsRead = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const message = await Message.findOne({
        _id: req.params.id,
        receiver: req.user.id
    });

    if (!message) {
        throw createError('Message not found', 404);
    }

    if (!message.isRead) {
        message.isRead = true;
        message.readAt = new Date();
        await message.save();

        // Emit read receipt to sender
        io.to(`user_${message.sender}`).emit('message-read', {
            messageId: message._id,
            readAt: message.readAt
        });
    }

    res.status(200).json({
        success: true,
        data: message
    });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const unreadCount = await Message.countDocuments({
        receiver: req.user.id,
        isRead: false
    });

    // Get unread count per match
    const unreadByMatch = await Message.aggregate([
        {
            $match: {
                receiver: req.user.id,
                isRead: false
            }
        },
        {
            $group: {
                _id: '$match',
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            total: unreadCount,
            byMatch: unreadByMatch.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        }
    });
});

// @desc    Delete message (soft delete)
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const message = await Message.findOne({
        _id: req.params.id,
        sender: req.user.id
    });

    if (!message) {
        throw createError('Message not found or unauthorized', 404);
    }

    // Check if message is older than 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (message.createdAt < tenMinutesAgo) {
        throw createError('Cannot delete messages older than 10 minutes', 400);
    }

    await Message.findByIdAndDelete(req.params.id);

    // Emit delete event to receiver
    io.to(`user_${message.receiver}`).emit('message-deleted', {
        messageId: message._id,
        matchId: message.match
    });

    res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
    });
});
