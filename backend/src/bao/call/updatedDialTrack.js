import path from 'path';
import dotenv from 'dotenv';
import dialRepository from '../../database/repositories/dial.repository';
import generateUserDialChannel from '../../utils/generateUserDialChannel';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import NotifierService from '../../services/notifier.service';
import CallService from '../../services/call.service';

const callService = new CallService();
const notifierService = new NotifierService();

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ audioTrack, videoTrack, dialId, user }) {
    const dial = await dialRepository.retrieve({ dial_id: dialId });

    if (!dial) throw new ApplicationResponseException('DIAL_NOT_FOUND', 'Dial not found', 404);

    if (dial.status !== 'engaged') throw new ApplicationResponseException('DIAL_NOT_FOUND', 'Dial not found', 404);

    await notifierService.sendClosedDialNotification(
        {
            __initiatorId: user.id,
            audio_track: audioTrack,
            video_track: videoTrack,
            profile_info: {
                username: user.username,
                full_name: user.full_name,
                avatar: user.avatar,
            },
        },
        generateUserDialChannel(dialId),
        'DIAL_TRACK_UPDATED',
    );

    return true;
}
