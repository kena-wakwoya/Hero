import { Router } from 'express';
import OnboardingRouter from './onboarding.router';
import AuthRouter from './auth.router';
import ProfileRouter from './profile.router';
import AlertRouter from './alert.router';
import CallRouter from './call.router';
import SmsService from '../../services/sms.service';
import UserRouter from './user.router';
const router = Router();

router.use('/onboarding', OnboardingRouter);
router.use('/profile', ProfileRouter);
router.use('/auth', AuthRouter);
router.use('/alert', AlertRouter);
router.use('/users', UserRouter);
router.use('/call', CallRouter);

router.get('/test-sms', async (req, res) => {
    const smsService = new SmsService();
    const data = {
        phoneNumber: req.query?.phone ? ` +${req.query?.phone?.trim()}` : `+2348135050987`,
        code: '1234',
    };
    try {
        const send = await smsService.sendVerificationCode(data);
        return res.json(send);
    } catch (error) {
        return res.send(error);
    }
});

export default router;
