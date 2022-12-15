import { Router } from 'express';
import callBAO from '../bao/call';

import { Pusher } from '../libraries';

const router = Router();

router.post('/authenticate', (req, res) => {
    try {
        const pusher = Pusher;
        const socketId = req.body?.socket_id;
        const user = {
            profile_info: {
                username: user.username,
                full_name: user.full_name,
                avatar: user.avatar,
            },
        };
        const authResponse = pusher.authenticateUser(socketId, user);
        res.send(authResponse);
    } catch (error) {
        next(error);
    }
});

router.post('/authorize', async (req, res, next) => {
    try {
        const pusher = Pusher;
        const socketId = req.body?.socket_id;
        const authUser = req.user;
        const channelName = req.body?.channel_name;
        await callBAO.authorizeCaller({ channelName, user: authUser });
        const authResponse = pusher.authorizeChannel(socketId, channelName);
        res.send(authResponse);
    } catch (error) {
        next(error);
    }
});

export default router;
