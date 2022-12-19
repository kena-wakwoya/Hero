import { Router } from 'express';
import { USERS_TYPE } from '../../config/constants';
import {
    loginWithEmail,
    changePassword,
    requestPassword,
    resetPassword,
    inviteUser,
    logoutUser,
} from '../../controllers/auth.controller';

import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import * as authDTO from '../../dto/auth.dto';

const router = Router();

router.post('/login', authDTO.loginWithEmail, loginWithEmail);
router.post('/logout', logoutUser);
router.post('/change-password', authDTO.changePassword, changePassword);
router.post('/request-password', authDTO.requestPassword, requestPassword);
router.post('/reset-password', authDTO.resetPassword, resetPassword);
router.post(
    '/invite-user',
    (req, _res, next) => {
        if (
            [USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER, USERS_TYPE.CENTRE_ADMIN].indexOf(
                req.user.account_type,
            ) === -1
        ) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    authDTO.inviteUser,
    inviteUser,
);

export default router;
