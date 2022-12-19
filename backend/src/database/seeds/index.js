import dotenv from 'dotenv';
import path from 'path';
import { USERS_TYPE, USER_ACTIONS } from '../../config/constants';
import passwordHelper from '../../utils/passwordHelper';
import userRepository from '../repositories/user.repository';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const createPlatformAdmin = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const { DEFAULT_PLATFORM_OWNER_EMAIL, DEFAULT_PLATFORM_OWNER_PASSWORD } = process.env;
            const passhash = await passwordHelper.hash(DEFAULT_PLATFORM_OWNER_PASSWORD);
            const platformAdmin = await userRepository.retrieve({ email: DEFAULT_PLATFORM_OWNER_EMAIL });
            if (!platformAdmin) {
                const actions_required = JSON.stringify([USER_ACTIONS.CHANGE_ACCOUNT_PASSWORD]);
                await userRepository.create({
                    email: DEFAULT_PLATFORM_OWNER_EMAIL,
                    full_name: 'Default Platform Owner',
                    username: DEFAULT_PLATFORM_OWNER_EMAIL,
                    account_type: USERS_TYPE.PLATFORM_OWNER,
                    password: passhash,
                    actions_required,
                    status: 'active',
                });
            }
            return resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

const run = async () => {
    return Promise.all([createPlatformAdmin()]);
};

export default {
    run,
};
