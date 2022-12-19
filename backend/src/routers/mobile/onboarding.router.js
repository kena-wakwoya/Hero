import { Router } from 'express';
import { checkUsername, verifyPhone, setupAccount } from '../../controllers/onboarding.controller';
import * as onboardingDTO from '../../dto/onboarding.dto';

const router = Router();

router.post('/check-username', onboardingDTO.checkUsername, checkUsername);
router.post('/verify-phone', onboardingDTO.verifyPhone, verifyPhone);
router.post('/setup-account', onboardingDTO.setupAccount, setupAccount);
router.get('/request-summary', (req, res) => {
    return res.json({
        status: 'success',
        data: {
            fingerprint: {
                components: { geoip: req.fingerprint?.components?.geoip },
            },
        },
    });
});

export default router;
