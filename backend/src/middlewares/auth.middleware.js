import _ from 'lodash';
import path from 'path';
import dotenv from 'dotenv';

import { Redis } from '../libraries/redis.library';

import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';
import { API_HEALTHCHECK_PATH, MOBILE_PATH_GROUP, WEB_PATH_GROUP, WEBHOOK_PATH_GROUP, PUSHER_PATH_GROUP } from '../routers';
import { extractTokenFromRequest, verifyToken } from '../utils/token';
import userRepository from '../database/repositories/user.repository';
import centreRepository from '../database/repositories/centre.repository';
import userCentreRepository from '../database/repositories/user-centre.repository';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default async (req, _res, next) => {
    const mobileOpenPathsArray = [
        '/test-sms',
        '/auth/login-with-phone',
        '/onboarding/check-username',
        '/onboarding/verify-phone',
        '/onboarding/setup-account',
        '/onboarding/request-summary',
    ].map((routePath) => `${MOBILE_PATH_GROUP}${routePath}`);

    const webOpenPathsArray = ['/auth/login', '/auth/request-password', '/auth/reset-password'].map(
        (routePath) => `${WEB_PATH_GROUP}${routePath}`,
    );

    try {
        const publicPaths = [
            '/uploads',
            API_HEALTHCHECK_PATH,
            WEBHOOK_PATH_GROUP,
            ...mobileOpenPathsArray,
            ...webOpenPathsArray,
        ];
        const shouldSkip = _.find(publicPaths, (item) => _.startsWith(req.url.toLowerCase(), item.toLowerCase()));
        if (shouldSkip || req.url.toLowerCase() === '/') return next();
        const STATUS_CODE = req.url.toLowerCase()?.startsWith(PUSHER_PATH_GROUP) ? 403 : 401;
        const token = extractTokenFromRequest(req);
        if (!token) {
            return next(new ApplicationResponseException('UNAUTHENTICATED', 'Token is missing', STATUS_CODE));
        }
        const { phone, type, email, id: tokenId } = verifyToken(token);
        const filter = {};

        if (phone) filter['phone'] = phone;
        if (email) filter['email'] = email;

        const user = await userRepository.retrieve(filter);

        if (!user) {
            return next(new ApplicationResponseException('UNAUTHENTICATED', 'User not found', STATUS_CODE));
        }

        const userCentreMatch = await userCentreRepository.retrieve({ user_id: user.id });
        let userCentre;

        if (userCentreMatch) userCentre = await centreRepository.retrieve({ id: userCentreMatch.centre_id });

        if (type === 'mobile-access-token' && _.startsWith(req.url, WEB_PATH_GROUP))
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Permission denied', 403));

        if (type === 'web-access-token' && _.startsWith(req.url, MOBILE_PATH_GROUP))
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Permission denied', 403));

        user.actions_required = JSON.parse(user?.actions_required || '[]');
        req.user = { ...JSON.parse(JSON.stringify(user)), user_centre: userCentre };

        const requestFingerprint = req?.fingerprint?.hash;
        console.log({ requestFingerprint });
        if (!requestFingerprint)
            return next(new ApplicationResponseException('UNAUTHENTICATED', 'Malformed request token', STATUS_CODE));
        const key = `sessions-${user.id}`;
        let sessions = await Redis.retrieve(key);
        sessions = JSON.parse(sessions);
        console.log({ sessions, tokenId });
        // if (typeof sessions !== 'object')
        //     return next(new ApplicationResponseException('UNAUTHENTICATED', 'Malformed request token', STATUS_CODE));
        // if (sessions?.[requestFingerprint] !== tokenId)
        //     return next(new ApplicationResponseException('UNAUTHENTICATED', 'Malformed request token', STATUS_CODE));
        return next();
    } catch (error) {
        return handleError(error, next);
    }
};

const handleError = (error, next) => {
    return next(error);
};
