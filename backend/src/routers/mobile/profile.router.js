import { Router } from 'express';
import { updateProfile, getMyProfile } from '../../controllers/profile.controller';

import * as profileDTO from '../../dto/profile.dto';
const router = Router();

router.get('/me', getMyProfile);
router.post('/', profileDTO.updateProfile, updateProfile);

export default router;
