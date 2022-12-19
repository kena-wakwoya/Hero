import dotenv from 'dotenv';
import path from 'path';
import { USERS_TYPE } from '../../config/constants';
import alertRepository from '../../database/repositories/alert.repository';
import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ user, accountId }) {
    let userAccount = await userRepository.retrieve({ id: accountId });
    if (!userAccount) {
        throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
    }
    if (user.account_type === USERS_TYPE.CENTRE_ADMIN) {
        const userCentre = await userCentreRepository.retrieve({ user_id: userAccount.id });
        if (user?.user_centre?.id !== userCentre.centre_id) {
            throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
        }
    }
    const alertCount = await alertRepository.getUserCount(user.id);
    return {
        username: user?.username || null,
        full_name: user?.full_name || null,
        dob: user.dob ? new Date(user.dob) : null,
        role: user.role || null,
        position: user.position || null,
        avatar: user?.avatar || null,
        email: user?.email || null,
        phone: user?.phone || null,
        followers_count: 0,
        following_count: 0,
        alerts_count: Number(alertCount) || 0,
    };
}
