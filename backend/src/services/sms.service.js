import { Twilio } from '../libraries';
import smsTemplates from '../config/smsTemplates';
import templateMessageBuilder from '../utils/templateMessageBuilder';

export default class {
    twilio;
    constructor() {
        this.twilio = new Twilio();
    }
    sendVerificationCode = (data) => {
        let { phoneNumber = '' } = data;
        if (!phoneNumber) return Promise.reject('No active phone number');
        const { body: template } = smsTemplates.verification;
        const body = templateMessageBuilder(template, data);
        return this.twilio.sms(phoneNumber, body);
    };
}
