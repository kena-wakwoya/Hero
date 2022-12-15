import { Router } from 'express';
import { loginWithPhone } from '../../controllers/auth.controller';

import * as onboardingDTO from '../../dto/onboarding.dto';
const router = Router();

router.post('/login-with-phone', onboardingDTO.verifyPhone, loginWithPhone);

export default router;
