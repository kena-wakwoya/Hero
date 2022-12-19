import { Router } from 'express';
import { USERS_TYPE } from '../../config/constants';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import {
    getHeroesList,
    changeAccountStatus,
    getCentreUsers,
    changeAccountType,
    getPlatforAdminList,
} from '../../controllers/user.controller';

import * as userDTO from '../../dto/user.dto';

const router = Router();

router.get(
    '/heroes',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    userDTO.getHeroesList,
    getHeroesList,
);

router.get(
    '/admin',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    userDTO.getHeroesList,
    getPlatforAdminList,
);

router.get(
    '/centre/list',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    userDTO.getCentreUsers,
    getCentreUsers,
);

router.post(
    '/status',
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
    userDTO.changeAccountStatus,
    changeAccountStatus,
);

router.post(
    '/account_type',
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
    userDTO.changeAccountType,
    changeAccountType,
);

export default router;
