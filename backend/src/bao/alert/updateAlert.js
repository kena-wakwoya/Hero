import { USERS_TYPE } from '../../config/constants';
import alertRepository from '../../database/repositories/alert.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

export default async function ({ alertId, status, user }) {
    const filter = {
        uuid: alertId,
    };
    if (user.account_type === USERS_TYPE.HERO) {
        const alert = await alertRepository.retrieve({ ...filter, user_id: user?.id });
        if (!alert) throw new ApplicationResponseException('ALERT_NOT_FOUND', 'Alert not found', 404);
    }
    await alertRepository.update(filter, { status });
    return true;
}
