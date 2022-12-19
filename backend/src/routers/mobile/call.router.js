import { Router } from 'express';

import {
    dialCentreAgents,
    endDial,
    listAllCalls,
    listInboundCalls,
    listOutboundCalls,
} from '../../controllers/call.controller';

import { USERS_TYPE } from '../../config/constants';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import * as callDTO from '../../dto/call.dto';

const router = Router();
router.get('/all-calls', callDTO.call, listAllCalls);
router.get('/inbound-calls', callDTO.call, listInboundCalls);
router.get('/outbound-calls', callDTO.call, listOutboundCalls);

router.post('/dial', callDTO.dial, dialCentreAgents);

router.post(
    '/end',
    (req, _res, next) => {
        if ([USERS_TYPE.HERO].indexOf(req.user.account_type) === -1) {
            return next(new ApplicationResponseException('PERMISSION_DENIED', 'Access denied', 403));
        }
        return next();
    },
    callDTO.accept,
    endDial,
);
router.get('/all-calls', callDTO.call, listAllCalls);
router.get('/inbound-calls', callDTO.call, listInboundCalls);
router.get('/outbound-calls', callDTO.call, listOutboundCalls);

export default router;
