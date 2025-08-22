import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
import { mockUsers } from '../data/mockData';

// Extend Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, university, course, age, gender } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user (simulate database creation)
    const newUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz', // Mock hashed password
      university,
      course,
      age: parseInt(age),
      gender,
      bio: '',
      interests: [],
      lifestyle: {
        sleepSchedule: 'moderado',
        cleanliness: 'organizado',
        socialLevel: 'moderado',
        studyHabits: 'moderado'
      },
      location: {
        city: '',
        state: '',
        neighborhood: ''
      },
      budget: {
        min: 500,
        max: 1500
      },
      preferences: {
        ageRange: { min: 18, max: 30 },
        genderPreference: 'qualquer',
        lifestyle: {
          sleepSchedule: ['cedo', 'moderado', 'tarde'],
          cleanliness: ['moderado', 'organizado', 'muito_organizado'],
          socialLevel: ['moderado', 'sociavel'],
          studyHabits: ['silencioso', 'moderado']
        }
      },
      profilePicture: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`,
      isActive: true,
      likedUsers: [],
      dislikedUsers: [],
      matchedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        ...newUser,
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real app, you'd verify the password with bcrypt
    // For mock purposes, accept any password
    console.log(`Mock login for ${email} with password: ${password}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        ...user,
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    
    const user = mockUsers.find(u => u._id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      ...user,
      password: undefined
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const updates = req.body;

    const userIndex = mockUsers.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user (simulate database update)
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      _id: userId, // Don't allow ID changes
      updatedAt: new Date()
    };

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...mockUsers[userIndex],
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { currentPassword, newPassword } = req.body;

    const userIndex = mockUsers.findIndex(u => u._id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real app, you'd verify the current password
    // For mock purposes, accept any current password
    console.log(`Mock password change for user ${userId}`);

    // Update password (simulate hashing)
    mockUsers[userIndex].password = '$2b$10$newhashedpassword';
    mockUsers[userIndex].updatedAt = new Date();

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
