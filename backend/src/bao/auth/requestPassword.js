import userRepository from '../../database/repositories/user.repository';
import passwordResetRepository from '../../database/repositories/password-reset.respository';
import { uuid } from 'uuidv4';
import EmailService from '../../services/email.service';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ email }) {
    const user = await userRepository.retrieve({ email: email });
    if (user) {
        const code = uuid();
        const existing = await passwordResetRepository.retrieve({ user_id: user.id });
        if (existing) {
            await passwordResetRepository.update({ id: existing.id }, { code });
        } else {
            await passwordResetRepository.create({ code, user_id: user.id });
        }
        const emailService = new EmailService();
        emailService.sendResetPassword({ name: user.full_name, token: code, expiry: '1 day', email });
    }
    return true;
}
