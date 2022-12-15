import alertRepository from '../../database/repositories/alert.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

export default async function ({ alertId, user, commentId }) {
    const alert = await alertRepository.retrieve({ uuid: alertId });
    if (!alert) throw new ApplicationResponseException('ALERT_NOT_FOUND', 'Alert not found', 404);
    if (alert?.status === 'deleted' || (alert.status === 'archive' && alert.user_id != user.id))
        throw new ApplicationResponseException('ALERT_NOT_FOUND', 'Alert not found', 404);
    const userAlertComment = await alertRepository.getUserAlertComment({ userId: user.id, commentId: commentId });
    if (!userAlertComment) throw new ApplicationResponseException('ALERT_COMMENT_NOT_FOUND', 'Alert comment not found', 404);
    await alertRepository.removeComment({ commentId, alertId, userId: user.id });
    return true;
}
