import { Router } from 'express';
import {
    followHero,
    unFollowHero,
    removeFollower,
    listCenterUserAdmin,
    administratorListCall,
    callOperatorStatistics,
    generateDashboardStats,
} from '../../controllers/user.controller';

import * as userDTO from '../../dto/user.dto';
import * as dashboardStats from '../../dto/dashboardStats.dto';
const router = Router();
router.post('/unfollow', userDTO.unFollowHero, unFollowHero);
router.post('/follow', userDTO.followHero, followHero);
router.post('/removeFollower', userDTO.removeFollower, removeFollower);
router.get('/centeruser/admin', userDTO.listCenterUserAdmin, listCenterUserAdmin);
router.get('/listcalls/admin', userDTO.listCenterUserAdmin, administratorListCall);
router.get('/call-operator/statistics', userDTO.listCenterUserAdmin, callOperatorStatistics);
router.get('/dashboard/stats', dashboardStats.generateDashboardStats, generateDashboardStats);
export default router;
