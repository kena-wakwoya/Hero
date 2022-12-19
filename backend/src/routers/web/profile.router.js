import { Router } from 'express';
import { updateProfile, getMyProfile, viewProfile } from '../../controllers/profile.controller';

import { USERS_TYPE } from '../../config/constants';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import * as profileDTO from '../../dto/profile.dto';

const router = Router();

router.get('/me', getMyProfile);
router.get(
    '/view/:accountId',
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
    profileDTO.view,
    viewProfile,
);
router.post('/', profileDTO.updateProfile, updateProfile);

export default router;
