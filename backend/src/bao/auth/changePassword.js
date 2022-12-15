import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import path from 'path';
import dotenv from 'dotenv';
import passwordHelper from '../../utils/passwordHelper';
import { USER_ACTIONS } from '../../config/constants';
import { Redis } from '../../libraries/redis.library';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ newPassword, oldPassword, user }) {
    const verify = await passwordHelper.compare(oldPassword, user.password);
    if (!verify) throw new ApplicationResponseException('INVALID_OLD_PASSWORD', 'Old password is invalid', 403);
    const newPasswordHash = await passwordHelper.hash(newPassword);
    const actions_required = user.actions_required?.filter((action) => {
        return action !== USER_ACTIONS.CHANGE_ACCOUNT_PASSWORD;
    });
    await userRepository.update(
        { id: user.id },
        { password: newPasswordHash, actions_required: JSON.stringify(actions_required) },
    );
    const key = `sessions-${user.id}`;
    await Redis.save(key, JSON.stringify([]), 60 * 60 * Number(process.env.ACTIVE_SESSION_HOURS));
    return true;
}
