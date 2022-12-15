import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { JWT_SECRET, ACTIVE_SESSION_HOURS } = process.env;

export const createShortLivedToken = (payload, expiresIn) => jwt.sign(payload, JWT_SECRET, { expiresIn });

export const createLongLivedToken = (payload, hours = Number(ACTIVE_SESSION_HOURS)) => {
    // expires midnight of third day
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + hours);
    expireDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    return jwt.sign(payload, JWT_SECRET, { expiresIn: Math.round((expireDate - todayDate) / 1000) + 5 });
};

export const extractTokenFromRequest = (req) => {
    const { authorization = null } = req.headers;
    if (authorization && typeof authorization === 'string') {
        const [tokenType, userToken] = authorization.split(' ');
        if (tokenType !== 'Bearer') return null;
        return userToken;
    }
    const { token = null } = req?.query;
    return token;
};

export const decodeToken = (token) => jwt.decode(token);

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
