import { Router } from 'express';
import { addCentre, updateCentre, removeCentre, listCentres, viewCentre } from '../../controllers/centre.controller';

import { USERS_TYPE } from '../../config/constants';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import * as centreDTO from '../../dto/centre.dto';
const router = Router();

router.post(
    '/add',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    centreDTO.add,
    addCentre,
);
router.put(
    '/update',
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
    centreDTO.update,
    updateCentre,
);
router.delete(
    '/remove',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    centreDTO.remove,
    removeCentre,
);
router.get(
    '/list',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    centreDTO.list,
    listCentres,
);
router.get(
    '/view/:domain',
    (req, _res, next) => {
        if ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    centreDTO.view,
    viewCentre,
);

export default router;
