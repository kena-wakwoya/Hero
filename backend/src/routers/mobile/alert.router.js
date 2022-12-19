import { Router } from 'express';
import {
    addAlert,
    listMyAlerts,
    removeAlert,
    archiveAlert,
    likeAlert,
    unlikeAlert,
    addComment,
    removeComment,
    listComments,
    listNewFeed,
} from '../../controllers/alert.controller';

import * as alertDTO from '../../dto/alert.dto';
const router = Router();

router.post('/', alertDTO.addAlert, addAlert);
router.delete('/remove', alertDTO.updateAlert, removeAlert);
router.put('/archive', alertDTO.updateAlert, archiveAlert);
router.get('/me', alertDTO.list, listMyAlerts);
router.post('/:alertId/like', likeAlert);
router.post('/:alertId/unlike', unlikeAlert);

router.get('/:alertId/comment/list', alertDTO.listComments, listComments);
router.post('/:alertId/comment', alertDTO.addComment, addComment);
router.delete('/:alertId/comment/:commentId', alertDTO.removeComment, removeComment);
router.get('/follower/newfeed', alertDTO.listNewFeed, listNewFeed);

export default router;
