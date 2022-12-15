import userRepository from '../../database/repositories/user.repository';
import passwordResetRepository from '../../database/repositories/password-reset.respository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

import path from 'path';
import dotenv from 'dotenv';
import passwordHelper from '../../utils/passwordHelper';
import { USER_ACTIONS } from '../../config/constants';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ newPassword, code }) {
    const passwordReset = await passwordResetRepository.retrieve({ code: code });
    if (!passwordReset) {
        throw new ApplicationResponseException('INAVLID_RESET_CODE', 'Reset code is not valid', 403);
    }
    const lastUpdatedDate = new Date(passwordReset.updated_at);
    lastUpdatedDate.setMinutes(lastUpdatedDate.getMinutes() + 1440);
    if (lastUpdatedDate < new Date()) {
        throw new ApplicationResponseException('RESET_CODE_EXPIRED', 'Reset code expired', 403);
    }
    const user = await userRepository.retrieve({ id: passwordReset.user_id });
    if (!user) {
        throw new ApplicationResponseException('INAVLID_RESET_CODE', 'Reset code is not valid', 403);
    }
    const newPasswordHash = await passwordHelper.hash(newPassword);
    user.actions_required = JSON.parse(user?.actions_required || '[]');
    const actions_required = user.actions_required?.filter((action) => {
        return action !== USER_ACTIONS.CHANGE_ACCOUNT_PASSWORD;
    });
    await Promise.allSettled([
        userRepository.update(
            { id: user.id },
            { password: newPasswordHash, actions_required: JSON.stringify(actions_required) },
        ),
        passwordResetRepository.remove({ code: code }),
    ]);
    return true;
}
