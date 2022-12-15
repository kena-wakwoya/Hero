import dotenv from 'dotenv';
import path from 'path';
import { USERS_TYPE } from '../../config/constants';

import userRepository from '../../database/repositories/user.repository';
import userCentreRepository from '../../database/repositories/user-centre.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ account_id, account_type, user: loggedUser }) {
    const user = await userRepository.retrieve({ id: account_id });

    if (!user || [USERS_TYPE.CENTRE_OPERATOR, USERS_TYPE.CENTRE_ADMIN].indexOf(user.account_type) === -1) {
        throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
    }

    if (loggedUser.account_type === USERS_TYPE.CENTRE_ADMIN) {
        const userCentre = await userCentreRepository.retrieve({ user_id: user.id });
        if (loggedUser?.user_centre?.id !== userCentre.centre_id) {
            throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
        }
    }

    await userRepository.update({ id: account_id }, { account_type: account_type });
    return null;
}
