import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import { createLongLivedToken } from '../../utils/token';
import { DIAL, USERS_TYPE } from '../../config/constants';

import path from 'path';
import dotenv from 'dotenv';
import passwordHelper from '../../utils/passwordHelper';
import { Redis } from '../../libraries/redis.library';
import { uuid } from 'uuidv4';
import generateUserDialChannel from '../../utils/generateUserDialChannel';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const { ACTIVE_SESSION_HOURS } = process.env;

export const afterLoginAction = async ({ user, requestFingerprint, tokenId }) => {
    if (requestFingerprint) {
        const key = `sessions-${user.id}`;
        let sessions = await Redis.retrieve(key);
        sessions = JSON.parse(sessions);
        if (typeof sessions !== 'object' || sessions === null) sessions = {};
        sessions[requestFingerprint] = tokenId;
        return Redis.save(`sessions-${user.id}`, JSON.stringify(sessions), 60 * 60 * Number(ACTIVE_SESSION_HOURS));
    }
    return Promise.resolve();
};

export default async function ({ email, password, requestFingerprint }) {
    const user = await userRepository.retrieve({ email: email });
    if (!user) throw new ApplicationResponseException('USER_LOGIN_ERROR', 'Login details is incorrect', 404);
    const verify = await passwordHelper.compare(password, user.password);
    if (!verify) throw new ApplicationResponseException('USER_LOGIN_ERROR', 'Login details is incorrect', 404);
    const tokenId = uuid();
    const accessToken = createLongLivedToken({ email, id: tokenId, type: 'web-access-token' }, Number(ACTIVE_SESSION_HOURS));
    const refreshToken = createLongLivedToken(
        { email, id: `${tokenId}-1`, type: 'web-refresh-token' },
        Number(ACTIVE_SESSION_HOURS) + 1,
    );
    if (user.status === 'invited') {
        await userRepository.update({ id: user.id }, { status: 'active' });
    }
    await afterLoginAction({ user, requestFingerprint, tokenId });

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        actions_required: JSON.parse((user?.actions_required ?? user.actions_required) || '[]'),
        dial_notification_channel_key: user?.account_type !== USERS_TYPE.HERO ? DIAL?.CENTRE_CHANNEL_NAME : '',
        personal_notification_channel_key: generateUserDialChannel(user.id),
        profile_info: {
            username: user.username,
            full_name: user.full_name,
            dob: user.dob ? new Date(user.dob) : null,
            avatar: user.avatar,
            email: user.email,
            phone: user.phone,
            role: user.account_type || null,
            position: user.position || null,
        },
    };
}
