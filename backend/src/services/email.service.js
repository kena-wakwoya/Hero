import { SendgridMail } from '../libraries';
import emailTemplates from '../config/emailTemplates';

export default class {
    twilio;
    constructor() {
        this.mail = new SendgridMail();
    }
    async sendInviteUser(data) {
        const { name, inviter_name, password, email } = data;
        const { id: templateId } = emailTemplates.inviteUser;
        return this.mail.send({ to: email, templateId }, { name, inviter_name, password, email });
    }
    async sendResetPassword(data) {
        const { name, token, expiry, email } = data;
        const { id: templateId } = emailTemplates.resetPassword;
        return this.mail.send({ to: email, templateId }, { name, token, expiry });
    }
}
