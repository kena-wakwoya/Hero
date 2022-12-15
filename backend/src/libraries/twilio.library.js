import path from 'path';
import twilio from 'twilio';
import dotenv from 'dotenv';
const { AccessToken } = twilio.jwt;
const { VideoGrant } = AccessToken;

dotenv.config({ path: path.join(__dirname, '../../.env') });

const {
    TWILIO_ACCOUNT_SID = 'ACb65462fd7f722342fe003c78abdf1af4',
    TWILIO_API_KEY_SID = 'SKe717b499e87c08c41d87596a4a4313af',
    TWILIO_API_KEY_SECRET = 'C7wLgcNMyxOgxAlU2nRZcnQ6Ccaqoflo',
    TWILIO_AUTH_TOKEN = '673042b962600ee8600090547d1d542a',
    TWILIO_NUMBER = '+19107254889',
    TWILIO_STATUS_CALLBACK,
} = process.env;

export class Twilio {
    constructor() {
        this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    }
    async sms(number, body) {
        return this.client.messages.create({ body, from: TWILIO_NUMBER, to: number });
    }
    async createRoom(roomName) {
        return this.client.video.rooms.create({
            recordParticipantsOnConnect: true,
            statusCallback: TWILIO_STATUS_CALLBACK,
            type: 'group',
            uniqueName: roomName,
            statusCallbackMethod: 'POST',
        });
    }
    async createRoomToken(roomName, identity) {
        const accessToken = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET);
        accessToken.identity = identity.toString();

        const grant = new VideoGrant({ room: roomName.toString() });

        accessToken.addGrant(grant);

        return accessToken.toJwt();
    }

    async completeRoom(roomName) {
        this.client.video.rooms(roomName).update({ status: 'completed' });
    }

    async getRoom(roomName) {
        return new Promise(async (resolve, reject) => {
            try {
                const rooms = await this.client.video.rooms.list({ uniqueName: roomName, limit: 1 });
                return resolve(rooms[0]);
            } catch (error) {
                return reject(error);
            }
        });
    }

    async getRoomRecordings(roomSid) {
        return this.client.video.rooms(roomSid).recordings.list();
    }

    async composeRoomRecordings(roomSid) {
        return this.client.video.compositions.create({
            roomSid: roomSid,
            audioSources: '*',
            videoLayout: {
                grid: {
                    video_sources: ['*'],
                },
            },
            statusCallback: TWILIO_STATUS_CALLBACK,
            format: 'mp4',
        });
    }

    async getCompositionMediaStream(cid) {
        return this.client.request({
            method: 'GET',
            uri: `https://video.twilio.com/v1/Compositions/${cid}/Media`,
        });
    }
}
