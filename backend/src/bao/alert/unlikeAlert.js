import alertRepository from '../../database/repositories/alert.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

export default async function ({ alertId, user }) {
    const alert = await alertRepository.retrieve({ uuid: alertId });
    if (!alert) throw new ApplicationResponseException('ALERT_NOT_FOUND', 'Alert not found', 404);
    await alertRepository.unregisterAlertLike({ alertId, userId: user.id });
    return true;
}
