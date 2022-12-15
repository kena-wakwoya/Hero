import path from 'path';
import dotenv from 'dotenv';
import getDialIdFromChannelName from '../../utils/getDialIdFromChannelName';
import dialRepository from '../../database/repositories/dial.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import { DIAL, USERS_TYPE } from '../../config/constants';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ channelName, user }) {
    if (DIAL.CENTRE_CHANNEL_NAME?.toLowerCase() === channelName?.toLowerCase()) {
        if ([USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(user).account_type === -1)
            throw new ApplicationResponseException('UNAUTHORIZED', 'Forbidden', 403);
        return true;
    }

    const { name: dialId, type } = getDialIdFromChannelName(channelName);

    if (type === 'dial') {
        const dial = await dialRepository.retrieve({ dial_id: dialId, status: 'open' });

        if (!dial) throw new ApplicationResponseException('DIAL_NOT_FOUND', 'Dial not found', 403);

        if ([...dial.originalUsers, ...dial.includedUsers].indexOf(user.id) === -1)
            throw new ApplicationResponseException('DIAL_NOT_FOUND', 'Dial not found', 403);
        return true;
    }

    if (type === 'user') {
        if (dialId?.toLowerCase() === user.id?.toLowerCase()) return true;
    }

    throw new ApplicationResponseException('UNAUTHORIZED', 'Forbidden', 403);
}
