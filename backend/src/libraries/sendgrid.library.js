import path from 'path';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const {
    SENDGRID_API_KEY = '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',
    MAIL_SENT_FROM = 'dev@heroalertall.com',
} = process.env;

export class SendgridMail {
    constructor() {
        this.mail = sgMail;
        this.mail.setApiKey(SENDGRID_API_KEY);
    }

    async send(headers, variables, attachments = null) {
        const { to, from = null, templateId } = headers;
        const msg = {
            to,
            from: from || MAIL_SENT_FROM,
            templateId,
            dynamic_template_data: {
                ...variables,
            },
            hideWarnings: true,
        };
        if (Array.isArray(attachments)) {
            msg.attachments = attachments;
        }
        return this.mail.send(msg);
    }
}
