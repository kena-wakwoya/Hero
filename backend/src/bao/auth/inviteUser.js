import userRepository from '../../database/repositories/user.repository';
import centreRepository from '../../database/repositories/centre.repository';
import userCentreRepository from '../../database/repositories/user-centre.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import generator from 'generate-password';

import path from 'path';
import dotenv from 'dotenv';
import passwordHelper from '../../utils/passwordHelper';
import { USER_ACTIONS, USERS_TYPE } from '../../config/constants';
import EmailService from '../../services/email.service';
import { merge } from 'lodash';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

function genPassword() {
    return generator.generate({
        length: 10,
        numbers: true,
    });
}

export default async function ({ email, accountType, fullName, centreDomain, user, position, phone }) {
    const existingUser = await userRepository.retrieve({ email });
    let centre;
    let invitedUser;

    if (existingUser && existingUser.status !== 'invited')
        throw new ApplicationResponseException('USER_EMAIL_ALREADY_EXISTS', 'User already exists', 409);

    if (centreDomain) {
        centre = await centreRepository.retrieve({ domain: centreDomain });
        if (!centre) throw new ApplicationResponseException('CENTRE_NOT_FOUND', 'Centre not found', 404);

        if (accountType !== USERS_TYPE.CENTRE_ADMIN) {
            const adminOfCentre = await userCentreRepository.getAdminOfCentre(centre.id);
            if (!adminOfCentre)
                throw new ApplicationResponseException(
                    'CENTRE_ADMIN_REQUIRED',
                    'An active administrator is required before adding an operator',
                    403,
                );
        }
    }

    if (phone) {
        const existingPhone = await userRepository.retrieve({ phone });
        if (existingPhone)
            throw new ApplicationResponseException('PHONE_ALREADY_EXISTS', 'Phone number already exists', 409);
    }

    const actions_required = JSON.stringify([USER_ACTIONS.CHANGE_ACCOUNT_PASSWORD]);
    const password = genPassword();

    const emailService = new EmailService();

    const newPasswordHash = await passwordHelper.hash(password);

    if (existingUser && existingUser.status === 'invited') {
        await userRepository.update(
            { id: existingUser.id },
            { full_name: fullName, password: newPasswordHash, position, phone },
        );
        invitedUser = merge(existingUser, { full_name: fullName, password: newPasswordHash, position, phone });
    } else {
        invitedUser = await userRepository.create({
            email: email,
            full_name: fullName,
            username: email,
            account_type: accountType,
            password: newPasswordHash,
            actions_required,
            position,
            phone,
        });
    }

    if (centre && invitedUser && [USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR].indexOf(accountType) > -1) {
        await userCentreRepository.create({ user_id: invitedUser.id, centre_id: centre.id });
    }

    emailService.sendInviteUser({
        email,
        name: fullName,
        inviter_name: user.full_name,
        password: password,
    });

    return {
        username: invitedUser.username,
        full_name: invitedUser.full_name,
        dob: invitedUser.dob ? new Date(invitedUser.dob) : null,
        avatar: invitedUser.avatar,
        email: invitedUser.email,
        phone: invitedUser.phone,
        role: invitedUser.role,
        updated_at: invitedUser.updated_at,
        created_at: invitedUser.created_at
    };
}
