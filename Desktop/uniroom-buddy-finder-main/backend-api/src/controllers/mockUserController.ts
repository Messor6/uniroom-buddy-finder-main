import { Request, Response } from 'express';
import { mockUsers, mockMatches } from '../data/mockData';

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

// Simula o cálculo de compatibilidade
const calculateCompatibility = (user1: any, user2: any) => {
  let score = 0;
  const factors = {
    lifestyle: 0,
    interests: 0,
    budget: 0,
    location: 0,
    preferences: 0
  };

  // Lifestyle compatibility (30%)
  const lifestyleScore = 
    (user1.lifestyle.sleepSchedule === user2.lifestyle.sleepSchedule ? 25 : 0) +
    (user1.lifestyle.cleanliness === user2.lifestyle.cleanliness ? 25 : 0) +
    (user1.lifestyle.socialLevel === user2.lifestyle.socialLevel ? 25 : 0) +
    (user1.lifestyle.studyHabits === user2.lifestyle.studyHabits ? 25 : 0);
  factors.lifestyle = lifestyleScore;

  // Interests compatibility (20%)
  const commonInterests = user1.interests.filter((interest: string) => 
    user2.interests.includes(interest)
  ).length;
  factors.interests = Math.min(100, (commonInterests / Math.max(user1.interests.length, user2.interests.length)) * 100);

  // Budget compatibility (20%)
  const budgetOverlap = Math.max(0, 
    Math.min(user1.budget.max, user2.budget.max) - Math.max(user1.budget.min, user2.budget.min)
  );
  factors.budget = budgetOverlap > 0 ? 100 : 50;

  // Location compatibility (15%)
  factors.location = user1.location.city === user2.location.city ? 100 : 30;

  // Preferences compatibility (15%)
  const ageMatch = user2.age >= user1.preferences.ageRange.min && 
                  user2.age <= user1.preferences.ageRange.max;
  const genderMatch = user1.preferences.genderPreference === 'qualquer' || 
                     user1.preferences.genderPreference === user2.gender;
  factors.preferences = (ageMatch ? 50 : 0) + (genderMatch ? 50 : 0);

  // Calculate weighted score
  score = Math.round(
    (factors.lifestyle * 0.3) +
    (factors.interests * 0.2) +
    (factors.budget * 0.2) +
    (factors.location * 0.15) +
    (factors.preferences * 0.15)
  );

  return { score, factors };
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { page = 1, limit = 10, ...filters } = req.query;

    let filteredUsers = mockUsers.filter(user => 
      user._id !== userId && 
      user.isActive &&
      !user.dislikedUsers.includes(userId) &&
      !user.matchedUsers.includes(userId)
    );

    // Apply filters
    if (filters.university) {
      filteredUsers = filteredUsers.filter(user => 
        user.university.toLowerCase().includes((filters.university as string).toLowerCase())
      );
    }

    if (filters.city) {
      filteredUsers = filteredUsers.filter(user => 
        user.location.city.toLowerCase().includes((filters.city as string).toLowerCase())
      );
    }

    if (filters.minAge || filters.maxAge) {
      filteredUsers = filteredUsers.filter(user => {
        const userAge = user.age;
        const minAge = filters.minAge ? parseInt(filters.minAge as string) : 0;
        const maxAge = filters.maxAge ? parseInt(filters.maxAge as string) : 100;
        return userAge >= minAge && userAge <= maxAge;
      });
    }

    // Pagination
    const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.status(200).json({
      users: paginatedUsers.map(user => ({
        ...user,
        password: undefined // Never send password
      })),
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(filteredUsers.length / parseInt(limit as string)),
        totalUsers: filteredUsers.length,
        hasNext: endIndex < filteredUsers.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPotentialMatches = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const currentUser = mockUsers.find(user => user._id === userId);
    
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const potentialMatches = mockUsers
      .filter(user => 
        user._id !== userId && 
        user.isActive &&
        !currentUser.likedUsers.includes(user._id) &&
        !currentUser.dislikedUsers.includes(user._id) &&
        !currentUser.matchedUsers.includes(user._id)
      )
      .map(user => {
        const compatibility = calculateCompatibility(currentUser, user);
        return {
          ...user,
          password: undefined,
          compatibility
        };
      })
      .sort((a, b) => b.compatibility.score - a.compatibility.score);

    res.status(200).json({
      matches: potentialMatches,
      count: potentialMatches.length
    });
  } catch (error) {
    console.error('Error getting potential matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likeUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { targetUserId } = req.params;

    const currentUser = mockUsers.find(user => user._id === userId);
    const targetUser = mockUsers.find(user => user._id === targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to liked users (simulate database update)
    if (!currentUser.likedUsers.includes(targetUserId)) {
      currentUser.likedUsers.push(targetUserId);
    }

    // Check if it's a mutual like (match)
    const isMatch = targetUser.likedUsers.includes(userId);
    
    if (isMatch) {
      // Create match (simulate database creation)
      currentUser.matchedUsers.push(targetUserId);
      targetUser.matchedUsers.push(userId);
      
      const compatibility = calculateCompatibility(currentUser, targetUser);
      const newMatch = {
        _id: `match_${Date.now()}`,
        users: [userId, targetUserId],
        status: 'matched',
        compatibility,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockMatches.push(newMatch);

      return res.status(200).json({
        match: true,
        message: 'It\'s a match!',
        matchData: newMatch
      });
    }

    res.status(200).json({
      match: false,
      message: 'User liked successfully'
    });
  } catch (error) {
    console.error('Error liking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const dislikeUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const { targetUserId } = req.params;

    const currentUser = mockUsers.find(user => user._id === userId);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to disliked users (simulate database update)
    if (!currentUser.dislikedUsers.includes(targetUserId)) {
      currentUser.dislikedUsers.push(targetUserId);
    }

    res.status(200).json({
      message: 'User disliked successfully'
    });
  } catch (error) {
    console.error('Error disliking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find(user => user._id === id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      ...user,
      password: undefined
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const updates = req.body;

    const user = mockUsers.find(user => user._id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data (simulate database update)
    Object.assign(user, {
      ...updates,
      updatedAt: new Date(),
      password: user.password // Keep original password
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...user,
        password: undefined
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
