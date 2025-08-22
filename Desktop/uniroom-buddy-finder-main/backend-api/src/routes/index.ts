import { Router, Application } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import matchRoutes from './matches';
import messageRoutes from './messages';

export const setRoutes = (app: Application) => {
    // API version prefix
    const apiRouter = Router();
    
    // Mount routes
    apiRouter.use('/auth', authRoutes);
    apiRouter.use('/users', userRoutes);
    apiRouter.use('/matches', matchRoutes);
    apiRouter.use('/messages', messageRoutes);
    
    // Mount API router with version prefix
    app.use('/api/v1', apiRouter);
    
    // Legacy route support (without version)
    app.use('/api', apiRouter);
};