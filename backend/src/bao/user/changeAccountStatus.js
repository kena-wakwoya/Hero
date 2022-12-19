import dotenv from 'dotenv';
import path from 'path';
import { USERS_TYPE } from '../../config/constants';

import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ account_id, status, user: loggedUser }) {
    const user = await userRepository.retrieve({ id: account_id });

    if (!user || user.account_type === USERS_TYPE.PLATFORM_OWNER) {
        throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
    }

    if (loggedUser.account_type === USERS_TYPE.CENTRE_ADMIN) {
        const userCentre = await userCentreRepository.retrieve({ user_id: user.id });
        if (loggedUser?.user_centre?.id !== userCentre.centre_id) {
            throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
        }
    }

    await userRepository.update({ id: account_id }, { status });
    return null;
}
