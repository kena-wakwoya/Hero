import path from 'path';
import dotenv from 'dotenv';
import generateUserDialChannel from '../../utils/generateUserDialChannel';
import generateDialNumber from '../../utils/generateDialNumber';
import NotifierService from '../../services/notifier.service';
import dialRepository from '../../database/repositories/dial.repository';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const notifierService = new NotifierService();

export default async function ({ location, user }) {
    const dialId = generateDialNumber();
    await dialRepository.create({
        dial_id: dialId,
        originalUsers: [user.id],
        call_details: {
            location,
        },
    });

    await notifierService.sendDialNotification({
        location,
        name: user?.full_name,
        avatar_url: user.avatar,
        email: user.email,
        dial_id: dialId,
        phone: user.phone,
        __initiatorId: user.id,
    });

    return {
        call_notification_channel_key: generateUserDialChannel(dialId),
    };
}
