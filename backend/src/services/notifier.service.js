import { Pusher } from '../libraries';
import { DIAL } from '../config/constants';

export default class {
    twilio;
    constructor() {
        this.pusher = Pusher;
    }

    async sendDialNotification(data, channelName = DIAL.CENTRE_CHANNEL_NAME) {
        return this.pusher.trigger(channelName, 'DIAL_CENTRE_NOTIFICATION', data);
    }

    async sendClosedDialNotification(data, channelName, eventName) {
        return this.pusher.trigger(channelName, eventName, data);
    }
}
