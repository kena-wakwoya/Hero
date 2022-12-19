import onboardingBAO from '../bao/onboarding';
import { ApplicationResponseException } from '../exceptions/ApplicationResponseException';

export const checkUsername = async (req, res, next) => {
    try {
        const {
            body: { username },
        } = req?.validatedInput;
        const data = await onboardingBAO.checkUsername(username);
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const verifyPhone = async (req, res, next) => {
    try {
        const {
            body: { phone, type, code },
        } = req?.validatedInput;
        const data = await onboardingBAO.verifyPhone({ phone, code, type });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const setupAccount = async (req, res, next) => {
    try {
        const {
            body: { fullName, username, onboardId },
        } = req?.validatedInput;
        const usernameCheck = await onboardingBAO.checkUsername(username);
        if (!usernameCheck.is_available) {
            throw new ApplicationResponseException('USERNAME_NOT_AVAILABLE', 'Username is not available', 422);
        }
        const data = await onboardingBAO.setupAccount({ username, onboardId, fullName });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};
