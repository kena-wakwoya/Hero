import authBAO from '../bao/auth';

import { Redis } from '../libraries/redis.library';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const loginWithPhone = async (req, res, next) => {
    try {
        const {
            body: { phone, code, type },
        } = req?.validatedInput;
        const data = await authBAO.loginWithPhone({ phone, code, type, requestFingerprint: req?.fingerprint?.hash });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const loginWithEmail = async (req, res, next) => {
    try {
        const {
            body: { email, password },
        } = req?.validatedInput;

        const data = await authBAO.loginWithEmail({
            email: email,
            password: password,
            requestFingerprint: req?.fingerprint?.hash,
        });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const {
            body: { oldPassword, newPassword },
        } = req?.validatedInput;
        const data = await authBAO.changePassword({ oldPassword, newPassword, user: req.user });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const {
            body: { newPassword, code },
        } = req?.validatedInput;
        const data = await authBAO.resetPassword({ newPassword, code });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const requestPassword = async (req, res, next) => {
    try {
        const {
            body: { email },
        } = req?.validatedInput;
        const data = await authBAO.requestPassword({ email });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const inviteUser = async (req, res, next) => {
    try {
        const {
            body: { email, accountType, fullName, centreDomain, position, phone },
        } = req?.validatedInput;
        const data = await authBAO.inviteUser({ email, accountType, fullName, centreDomain, user: req?.user, position, phone });
        return res.json({ status: 'success', data });
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        const requestFingerprint = req?.fingerprint?.hash;
        const user = req.user;
        if (requestFingerprint) {
            const key = `sessions-${user.id}`;
            let sessions = await Redis.retrieve(key);
            sessions = JSON.parse(sessions);
            if (typeof sessions === 'object' && sessions !== null) {
                delete sessions[requestFingerprint];
                await Redis.save(
                    `sessions-${user.id}`,
                    JSON.stringify(sessions),
                    60 * 60 * Number(process.env.ACTIVE_SESSION_HOURS),
                );
            }
        }
        res.json({ status: 'success' });
    } catch (error) {
        next(error);
    }
};
