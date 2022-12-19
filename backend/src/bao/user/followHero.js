import dotenv from 'dotenv';
import path from 'path';

import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ hero_id: hero_id, user_id: user_id }) {
    const hero = await userRepository.retrieve({ id: hero_id });
    if (!hero) {
        throw new ApplicationResponseException('USER_NOT_FOUND', 'Hero not found', 404);
    }
    const checkFollow = await userRepository.checkFollowers({ hero_uuid: hero_id, user_id: user_id });
    if (checkFollow) {
        throw new ApplicationResponseException('ALREADY_FOLLOWING', 'You are already following', 404);
    }
    return userRepository.followHero({ id: hero_id, user: user_id });
}
