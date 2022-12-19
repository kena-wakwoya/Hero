import { Router } from 'express';
import CentreRouter from './centre.router';
import AuthRouter from './auth.router';
import ProfileRouter from './profile.router';
import UserRouter from './user.router';
import AlertRouter from './alert.router';
import CallRouter from './call.router';

import { USER_ACTIONS } from '../../config/constants';
import checkActionRequiredMiddleware from '../../middlewares/check-action-required.middleware';

const router = Router();

router.use((req, _, next) => {
    if (['/auth/login', '/auth/change-password'].indexOf(req.url) === -1) {
        return checkActionRequiredMiddleware([USER_ACTIONS.CHANGE_ACCOUNT_PASSWORD])(req, _, next);
    }
    return next();
});
router.use('/centres', CentreRouter);
router.use('/profile', ProfileRouter);
router.use('/user', UserRouter);
router.use('/auth', AuthRouter);
router.use('/alert', AlertRouter);
router.use('/call', CallRouter);

export default router;
