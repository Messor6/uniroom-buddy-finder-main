import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import path from 'path';

// Mock controllers
import * as mockAuthController from './controllers/mockAuthController';
import * as mockUserController from './controllers/mockUserController';
import { mockUsers, mockMatches, mockMessages } from './data/mockData';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for Socket.IO
const server = createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Simple auth middleware for mock
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    
    socket.on('send-message', (data) => {
        // Save message to mock data
        const newMessage = {
            _id: `msg_${Date.now()}`,
            match: String(data.roomId || ''),
            sender: String(data.sender || ''),
            receiver: String(data.receiver || 'unknown'),
            content: String(data.content || ''),
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        (mockMessages as any[]).push(newMessage);
        
        socket.to(data.roomId).emit('receive-message', newMessage);
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'UniRoom Buddy Finder API is running (MOCK MODE)',
        mode: 'MOCK_DATA',
        timestamp: new Date().toISOString(),
        data: {
            users: mockUsers.length,
            matches: mockMatches.length,
            messages: mockMessages.length
        }
    });
});

// Auth routes (no middleware needed)
app.post('/api/auth/register', mockAuthController.register);
app.post('/api/auth/login', mockAuthController.login);

// Protected routes (require auth)
app.get('/api/auth/profile', mockAuthMiddleware, mockAuthController.getProfile);
app.put('/api/auth/profile', mockAuthMiddleware, mockAuthController.updateProfile);
app.put('/api/auth/change-password', mockAuthMiddleware, mockAuthController.changePassword);

// User routes
app.get('/api/users', mockAuthMiddleware, mockUserController.getUsers);
app.get('/api/users/matches', mockAuthMiddleware, mockUserController.getPotentialMatches);
app.get('/api/users/:id', mockAuthMiddleware, mockUserController.getUserById);
app.post('/api/users/:targetUserId/like', mockAuthMiddleware, mockUserController.likeUser);
app.post('/api/users/:targetUserId/dislike', mockAuthMiddleware, mockUserController.dislikeUser);

// Match routes
app.get('/api/matches', mockAuthMiddleware, (req: any, res: any) => {
    const { userId } = req.user;
    const userMatches = mockMatches.filter(match => 
        match.users.includes(userId)
    );
    
    const matchesWithUsers = userMatches.map(match => {
        const otherUserId = match.users.find(id => id !== userId);
        const otherUser = mockUsers.find(user => user._id === otherUserId);
        return {
            ...match,
            otherUser: otherUser ? { ...otherUser, password: undefined } : null
        };
    });
    
    res.json({ matches: matchesWithUsers });
});

app.get('/api/matches/:id', mockAuthMiddleware, (req: any, res: any) => {
    const { id } = req.params;
    const { userId } = req.user;
    
    const match = mockMatches.find(m => m._id === id && m.users.includes(userId));
    if (!match) {
        return res.status(404).json({ error: 'Match not found' });
    }
    
    const otherUserId = match.users.find(uid => uid !== userId);
    const otherUser = mockUsers.find(user => user._id === otherUserId);
    
    res.json({
        ...match,
        otherUser: otherUser ? { ...otherUser, password: undefined } : null
    });
});

// Message routes
app.get('/api/matches/:matchId/messages', mockAuthMiddleware, (req: any, res: any) => {
    const { matchId } = req.params;
    const { userId } = req.user;
    
    // Verify user is part of this match
    const match = mockMatches.find(m => m._id === matchId && m.users.includes(userId));
    if (!match) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const messages = mockMessages.filter(msg => msg.match === matchId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    res.json({ messages });
});

app.post('/api/matches/:matchId/messages', mockAuthMiddleware, (req: any, res: any) => {
    const { matchId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;
    
    // Verify user is part of this match
    const match = mockMatches.find(m => m._id === matchId && m.users.includes(userId));
    if (!match) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const receiverId = match.users.find(id => id !== userId);
    
    const newMessage = {
        _id: `msg_${Date.now()}`,
        match: matchId,
        sender: userId,
        receiver: receiverId || 'unknown',
        content,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    (mockMessages as any[]).push(newMessage);
    
    // Emit via Socket.IO
    io.to(matchId).emit('receive-message', newMessage);
    
    res.status(201).json({ message: newMessage });
});

// Mock data endpoints (for testing)
app.get('/api/mock/users', (req, res) => {
    res.json({ 
        users: mockUsers.map(user => ({ ...user, password: undefined }))
    });
});

app.get('/api/mock/matches', (req, res) => {
    res.json({ matches: mockMatches });
});

app.get('/api/mock/messages', (req, res) => {
    res.json({ messages: mockMessages });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        message: 'The requested endpoint does not exist',
        mode: 'MOCK_DATA'
    });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
    console.error('Error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        mode: 'MOCK_DATA'
    });
});

server.listen(PORT, () => {
    console.log(`🚀 UniRoom Buddy Finder API server is running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔄 Mode: MOCK DATA (MongoDB not required)`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`📝 Mock Data: ${mockUsers.length} users, ${mockMatches.length} matches, ${mockMessages.length} messages`);
});

export { io };
