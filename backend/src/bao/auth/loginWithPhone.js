import phoneRepository from '../../database/repositories/phone.repository';
import userRepository from '../../database/repositories/user.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import SmsService from '../../services/sms.service';
import { createLongLivedToken } from '../../utils/token';
import generateCode from '../../utils/generateCode';
import generateUserDialChannel from '../../utils/generateUserDialChannel';
import { DIAL, USERS_TYPE } from '../../config/constants';

import path from 'path';
import dotenv from 'dotenv';

import { afterLoginAction } from './loginWithEmail';
import { uuid } from 'uuidv4';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const { ACTIVE_SESSION_HOURS } = process.env;

const confirmPhoneVerification = async (phone, code, requestFingerprint) => {
    const phoneRecord = await phoneRepository.retrieve({ value: phone, type: 'login' });
    if (!phoneRecord || phoneRecord.status !== 'verified') {
        throw new ApplicationResponseException(
            'PHONE_NOT_FOUND',
            'Phone number not found for verification. Consider requesting a verification before confirmation',
            404,
        );
    }
    if (phoneRecord.code !== code) {
        throw new ApplicationResponseException('INVALID_PHONE_CODE', 'Invalid confirmation code', 422);
    }
    const data = {
        status: 'unknown',
        code: '',
    };
    await phoneRepository.updateOrCreate({ value: phone, type: 'login' }, { ...data, value: phone }, true);
    const user = await userRepository.retrieve({ phone });
    if (!user) {
        throw new ApplicationResponseException('INTERNAL_SERVER_ERROR', 'An internal server error occurred', 500);
    }
    const tokenId = uuid();
    const accessToken = createLongLivedToken({ phone, id: tokenId, type: 'mobile-access-token' });
    const refreshToken = createLongLivedToken(
        { phone, id: `${tokenId}-1`, type: 'mobile-refresh-token' },
        Number(ACTIVE_SESSION_HOURS) + 1,
    );

    await afterLoginAction({ user, requestFingerprint, tokenId });
    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        dial_notification_channel_key: user?.account_type !== USERS_TYPE.HERO ? DIAL?.CENTRE_CHANNEL_NAME : '',
        personal_notification_channel_key: generateUserDialChannel(user.id),
        profile_info: {
            username: user.username,
            full_name: user.full_name,
            dob: user.dob ? new Date(user.dob) : null,
            avatar: user.avatar,
            email: user.email,
            phone: user.phone,
            role: user.account_type || null,
            position: user.position || null,
        },
    };
};

const requestPhoneVerification = async (phone) => {
    const userRecord = await userRepository.retrieve({ phone: phone });
    if (!userRecord) {
        throw new ApplicationResponseException('USER_NOT_FOUND', 'No account found with the provided phone number', 404);
    }
    const requestedTime = new Date();
    const phoneRecord = await phoneRepository.retrieve({ value: phone, type: 'login' });
    if (phoneRecord) {
        if (phoneRecord.status === 'expired') {
            throw new ApplicationResponseException(
                'PHONE_NOT_FOUND',
                'Phone number not found for verification. Consider requesting a verification before confirmation',
                404,
            );
        }
        const lastSentTime = new Date(phoneRecord.updated_at);
        lastSentTime.setSeconds(lastSentTime.getSeconds() + 59);
        if (requestedTime < lastSentTime) {
            throw new ApplicationResponseException(
                'RESEND_TOO_SOON',
                'Please wait 1 minute after last verify request before requesting a new verification code',
                403,
            );
        }
    }

    const smsService = new SmsService();

    const data = {
        phoneNumber: `+${phone}`,
        code: generateCode(),
        status: 'verified',
        type: 'login',
        otherId: null,
    };

    const send = await smsService.sendVerificationCode(data).catch((error) => {
        if (error?.status === 400) {
            throw new ApplicationResponseException('INVALID_PHONE_NUMBER', 'Invalid phone number provider', 422);
        }
    });

    console.log({ send });

    await phoneRepository.updateOrCreate(
        { value: phone, type: 'login' },
        { ...data, value: phone },
        phoneRecord ? true : false,
    );
    return null;
};

export default async function ({ phone, type, code, requestFingerprint }) {
    let data = null;
    if (type === 'request') data = await requestPhoneVerification(phone);
    if (type === 'confirm') data = await confirmPhoneVerification(phone, code, requestFingerprint);
    return data;
}
