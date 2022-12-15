import phoneRepository from '../../database/repositories/phone.repository';
import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import path from 'path';
import dotenv from 'dotenv';
import { createLongLivedToken } from '../../utils/token';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const { ACTIVE_SESSION_HOURS } = process.env;

export default async function ({ username, onboardId, fullName }) {
    const phoneRecord = await phoneRepository.retrieve({ otherId: onboardId, type: 'registration', status: 'verified' });
    if (!phoneRecord) {
        throw new ApplicationResponseException('ONBOARD_SESSION_NOT_FOUND', 'User onboarding session not found.', 404);
    }
    await userRepository.create({ full_name: fullName, username, phone: phoneRecord.value, status: 'active' });
    await phoneRepository.updateOrCreate(
        { otherId: onboardId, type: 'registration', status: 'verified' },
        { otherId: null, type: 'registration', status: 'expired', code: '' },
        true,
    );

    const accessToken = createLongLivedToken({ phone: phoneRecord.value, type: 'mobile-access-token' });
    const refreshToken = createLongLivedToken(
        { phone: phoneRecord.value, type: 'mobile-refresh-token' },
        Number(ACTIVE_SESSION_HOURS) + 1,
    );

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
    };
}
