import { Router } from 'express';
import TwilioRouter from './twilio.webhook';

const router = Router();

router.use('/twilio', TwilioRouter);

export default router;
