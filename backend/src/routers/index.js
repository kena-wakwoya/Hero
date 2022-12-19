import initializeMobileRoutes from './mobile';
import initializeWebRoutes from './web';
import initializeWebhookRoutes from './webhook';
import initializePusherRoutes from './pusher.router';
import express from 'express';
import path from 'path';

const routes = (app) => {
    app.get(API_HEALTHCHECK_PATH, async (_, res) => res.send('Status => OK'));
    app.use(MOBILE_PATH_GROUP, initializeMobileRoutes);
    app.use(WEB_PATH_GROUP, initializeWebRoutes);
    if (process.env.NODE_ENV === 'development') {
        app.use('/uploads', express.static(path.join(__dirname, '/../../uploads')));
    }
    app.use(PUSHER_PATH_GROUP, initializePusherRoutes);
    app.use(WEBHOOK_PATH_GROUP, initializeWebhookRoutes);
    app.use((_, res) => {
        return res.status(404).send('Not found');
    });
};

export const MOBILE_PATH_GROUP = '/api/mobile';
export const API_HEALTHCHECK_PATH = '/api/healthcheck';
export const WEB_PATH_GROUP = '/api/web';
export const PUSHER_PATH_GROUP = '/api/pusher';
export const WEBHOOK_PATH_GROUP = '/api/webhook';

export default routes;
