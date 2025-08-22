import { User } from '../models/User';
import { Match } from '../models/Match';
import { Message } from '../models/Message';

// User services
export const userService = {
    async findUserById(id: string) {
        return await User.findById(id).select('-password');
    },

    async findUserByEmail(email: string) {
        return await User.findOne({ email }).select('-password');
    },

    async updateUserLastActive(id: string) {
        return await User.findByIdAndUpdate(
            id,
            { lastActive: new Date() },
            { new: true }
        );
    },

    async getUserStats(id: string) {
        const user = await User.findById(id);
        if (!user) return null;

        const totalMatches = await Match.countDocuments({
            users: id,
            status: 'matched',
            isActive: true
        });

        const totalMessages = await Message.countDocuments({
            $or: [{ sender: id }, { receiver: id }]
        });

        return {
            totalMatches,
            totalMessages,
            totalLikes: user.likedUsers.length,
            totalDislikes: user.dislikedUsers.length,
            profileCompleteness: calculateProfileCompleteness(user)
        };
    }
};

// Match services
export const matchService = {
    async createMatch(user1Id: string, user2Id: string, compatibility: any) {
        return await Match.create({
            users: [user1Id, user2Id],
            status: 'matched',
            initiatedBy: user1Id,
            matchedAt: new Date(),
            compatibility
        });
    },

    async findMatchByUsers(user1Id: string, user2Id: string) {
        return await Match.findOne({
            users: { $all: [user1Id, user2Id] }
        });
    },

    async getActiveMatches(userId: string) {
        return await Match.find({
            users: userId,
            status: 'matched',
            isActive: true
        }).populate('users', 'name avatar university course age');
    }
};

// Message services
export const messageService = {
    async createMessage(data: {
        match: string;
        sender: string;
        receiver: string;
        content: string;
        messageType?: string;
    }) {
        return await Message.create({
            ...data,
            isDelivered: true,
            deliveredAt: new Date()
        });
    },

    async markMessagesAsRead(matchId: string, userId: string) {
        return await Message.updateMany(
            {
                match: matchId,
                receiver: userId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );
    },

    async getUnreadCount(userId: string) {
        return await Message.countDocuments({
            receiver: userId,
            isRead: false
        });
    }
};

// Notification services
export const notificationService = {
    async sendMatchNotification(userId: string, matchId: string) {
        // Placeholder for push notification service
        console.log(`Sending match notification to user ${userId} for match ${matchId}`);
    },

    async sendMessageNotification(userId: string, senderId: string, content: string) {
        // Placeholder for push notification service
        console.log(`Sending message notification to user ${userId} from ${senderId}: ${content}`);
    }
};

// Helper functions
function calculateProfileCompleteness(user: any): number {
    const fields = [
        'name', 'email', 'avatar', 'university', 'course', 'age', 
        'gender', 'bio', 'interests', 'lifestyle', 'location', 'budget'
    ];
    
    let completedFields = 0;
    
    fields.forEach(field => {
        if (field === 'interests') {
            if (user[field] && user[field].length > 0) completedFields++;
        } else if (field === 'lifestyle' || field === 'location' || field === 'budget') {
            if (user[field] && Object.keys(user[field]).length > 0) completedFields++;
        } else if (user[field]) {
            completedFields++;
        }
    });
    
    return Math.round((completedFields / fields.length) * 100);
}