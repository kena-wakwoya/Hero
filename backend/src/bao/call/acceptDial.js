import path from 'path';
import dotenv from 'dotenv';
import dialRepository from '../../database/repositories/dial.repository';
import generateUserChannel from '../../utils/generateUserChannel';
import generateUserDialChannel from '../../utils/generateUserDialChannel';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import NotifierService from '../../services/notifier.service';
import CallService from '../../services/call.service';

const callService = new CallService();
const notifierService = new NotifierService();

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ dialId, user }) {
    const dial = await dialRepository.retrieve({ dial_id: dialId });

    let callRoom;
    let callToken;

    if (!dial) throw new ApplicationResponseException('DIAL_NOT_FOUND', 'Dial not found', 404);

    if (dial.status === 'open') {
        const allParticipants = [...new Set([...dial.originalUsers, ...dial.includedUsers, user.id])];

        callRoom = await callService.createRoom(dialId).catch(async (error) => {
            if (error.message === 'Room exists') {
                // previously created and has not been used by the system
                const room = await callService.getRoom(dialId);
                return room;
            }
            throw error;
        });

        const participants = [];

        for (const participantId of allParticipants) {
            const token = await callService.generateRoomToken(callRoom.uniqueName, participantId);
            const participant = {};
            if (participantId?.toLowerCase() === user.id?.toLowerCase()) callToken = token;
            participant['id'] = participantId;
            participant['access_token'] = token;
            participants.push(participant);
        }

        await dialRepository.update(
            { dial_id: dialId },
            {
                originalUsers: [...dial.originalUsers, user.id],
                status: 'engaged',
                call_details: {
                    ...dial.call_details,
                    room: {
                        sid: callRoom.sid,
                        uniqueName: callRoom.uniqueName,
                        participants,
                    },
                },
            },
        );

        let notificationPromises = [];
        for (let participant of participants) {
            const participantId = participant.id;
            notificationPromises.push(
                participantId?.toLowerCase() !== user.id?.toLowerCase()
                    ? notifierService.sendClosedDialNotification(
                          {
                              call_id: callRoom.sid,
                              call_token: participant.access_token,
                              __initiatorId: user.id,
                          },
                          generateUserChannel(participant.id),
                          'DIAL_ACCEPTED',
                      )
                    : Promise.resolve(true),
            );
        }

        await Promise.all(notificationPromises);
    }

    let is_call_engaged = dial.status !== 'open';

    if ([...dial.originalUsers, ...dial.includedUsers].indexOf(user.id.toLowerCase()) > -1 && dial.status === 'engaged') {
        is_call_engaged = false;
        callRoom = dial?.call_details?.room;
        const participant = dial?.call_details?.room?.participants?.find((participant) => {
            return participant.id?.toLowerCase() === user.id.toLowerCase();
        });
        callToken = participant?.['access_token'];
    }

    return {
        call_id: callRoom?.sid || null,
        call_token: callToken || null,
        call_notification_channel_key: callToken ? generateUserDialChannel(dialId) : null,
        is_call_engaged,
    };
}
