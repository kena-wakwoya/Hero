import phoneRepository from '../../database/repositories/phone.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
import SmsService from '../../services/sms.service';
import { uuid } from 'uuidv4';
import generateCode from '../../utils/generateCode';

const confirmPhoneVerification = async (phone, code) => {
    const phoneRecord = await phoneRepository.retrieve({ value: phone, type: 'registration' });
    if (!phoneRecord || phoneRecord.status !== 'unknown') {
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
        status: 'verified',
        otherId: uuid(),
    };
    await phoneRepository.updateOrCreate({ value: phone, type: 'registration' }, { ...data, value: phone }, true);
    return data.otherId;
};

const requestPhoneVerification = async (phone) => {
    const requestedTime = new Date();
    const phoneRecord = await phoneRepository.retrieve({ value: phone, type: 'registration' });
    if (phoneRecord) {
        if (phoneRecord.status === 'expired') {
            throw new ApplicationResponseException(
                'PHONE_ALREADY_ONBOARDED',
                'An account with this phone number has been onboarded. Try a different number or login',
                409,
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
        status: 'unknown',
        type: 'registration',
        otherId: uuid(),
    };
    const send = await smsService.sendVerificationCode(data).catch((error) => {
        if (error?.status === 400) {
            throw new ApplicationResponseException('INVALID_PHONE_NUMBER', 'Invalid phone number provider', 422);
        }
    });
    await phoneRepository.updateOrCreate(
        { value: phone, type: 'registration' },
        { ...data, value: phone },
        phoneRecord ? true : false,
    );
};

export default async function ({ phone, code, type = 'request' }) {
    let onboardId = null;
    if (type === 'request') await requestPhoneVerification(phone);
    if (type === 'confirm') onboardId = await confirmPhoneVerification(phone, code);
    return {
        onboard_id: onboardId,
    };
}
