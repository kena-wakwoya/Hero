import { Router } from 'express';
import { listAlerts, removeAlert, archiveAlert, activateAlert } from '../../controllers/alert.controller';

import { USERS_TYPE } from '../../config/constants';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import * as alertDTO from '../../dto/alert.dto';
const router = Router();

router.get(
    '/list',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    alertDTO.list,
    listAlerts,
);

router.delete(
    '/remove',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    alertDTO.updateAlert,
    removeAlert,
);

router.put(
    '/archive',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    alertDTO.updateAlert,
    archiveAlert,
);

router.put(
    '/activate',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    alertDTO.updateAlert,
    activateAlert,
);

export default router;
