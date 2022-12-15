import dotenv from 'dotenv';
import path from 'path';

import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ hero_id, user_id }) {
    const checkFollow = await userRepository.checkFollowers({ hero_uuid: hero_id, user_id: user_id });

    if (!checkFollow) {
        throw new ApplicationResponseException('USER_NOT_FOUND', 'Hero not found', 404);
    }
    return userRepository.unFollowHero({ id: hero_id, user_id: user_id });
}
