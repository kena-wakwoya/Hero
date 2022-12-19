import dotenv from 'dotenv';
import path from 'path';

import { USERS_TYPE } from '../../config/constants';
import userRepository from '../../database/repositories/user.repository';
import userCentreRepository from '../../database/repositories/user-centre.repository';
import StorageService from '../../services/storage.service';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import generateCode from '../../utils/generateCode';

dotenv.config({ path: path.join(__dirname, '../../../.env') });
const { CLOUDFRONT_URL } = process.env;

export default async function ({ email, dob, avatar, user, fullName, account_id, position, phone }) {
    const update = {};

    if (account_id) {
        let userAccount = await userRepository.retrieve({ id: account_id });
        if (!userAccount || userAccount.status === 'deleted') {
            throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
        }
        if (user.account_type === USERS_TYPE.CENTRE_ADMIN) {
            const userCentre = await userCentreRepository.retrieve({ user_id: userAccount.id });
            if (user?.user_centre?.id !== userCentre.centre_id) {
                throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found', 404);
            }
        }
        user = userAccount;
    }

    if (dob) update.dob = dob;
    if (position) update.position = position;
    if (fullName) update.full_name = fullName;

    if (email) {
        update.email = email;
        const existingEmailUser = await userRepository.retrieve({ email });
        if (existingEmailUser) {
            throw new ApplicationResponseException(
                'PROFILE_EMAIL_ALREADY_EXISTS',
                'Email is already associated with another user',
                409,
            );
        }
        if (user.account_type !== USERS_TYPE.HERO) update.username = email;
    }

    if (phone) {
        update.phone = phone;
        const existingPhoneUser = await userRepository.retrieve({ phone });
        if (existingPhoneUser) {
            throw new ApplicationResponseException(
                'PROFILE_PHONE_ALREADY_EXISTS',
                'Phone is already associated with another user',
                409,
            );
        }
    }

    if (avatar) {
        const storageService = new StorageService();

        const avatarName = `${generateCode(15)}-avatar.png`;

        const { path: filePath } = await storageService.uploadProfileAvatar(avatar, avatarName);

        update.avatar = process.env.NODE_ENV === 'development' ? filePath : `${CLOUDFRONT_URL}/${avatarName}`;
    }

    await userRepository.update({ id: user.id }, update);

    return null;
}
