import { Router } from 'express';
import { acceptDial, endDial } from '../../controllers/call.controller';

import { USERS_TYPE } from '../../config/constants';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import * as callDTO from '../../dto/call.dto';
const router = Router();

router.post(
    '/accept',
    (req, _res, next) => {
        if ([USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    callDTO.accept,
    acceptDial,
);

router.post(
    '/end',
    (req, _res, next) => {
        if ([USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    callDTO.accept,
    endDial,
);

router.post(
    '/track',
    (req, _res, next) => {
        if ([USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    callDTO.track,
    endDial,
);

export default router;
