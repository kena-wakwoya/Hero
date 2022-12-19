import path from 'path';
import dotenv from 'dotenv';
import { Twilio } from '../libraries';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default class {
    twilio;
    constructor() {
        this.twilio = new Twilio();
    }

    async createRoom(name) {
        return this.twilio.createRoom(name);
    }

    async generateRoomToken(roomName, userId) {
        return this.twilio.createRoomToken(roomName, userId);
    }

    async completeRoom(roomName) {
        return this.twilio.completeRoom(roomName);
    }

    async getRoom(roomName) {
        return this.twilio.getRoom(roomName);
    }

    async getMeetingMediaStream(compositionSid) {
        return this.twilio.getCompositionMediaStream(compositionSid);
    }

    async getMeetingRecordings(roomSid) {
        return this.twilio.getRoomRecordings(roomSid);
    }

    async composeMeetingVideo(roomSid) {
        return this.twilio.composeRoomRecordings(roomSid);
    }
}
