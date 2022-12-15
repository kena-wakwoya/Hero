import dotenv from 'dotenv';
import path from 'path';
import alertRepository from '../../database/repositories/alert.repository';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ user }) {
    const alertCount = await alertRepository.getUserCount(user.id);
    return {
        username: user?.username || null,
        full_name: user?.full_name || null,
        dob: user.dob ? new Date(user.dob) : null,
        role: user.account_type || null,
        position: user.position || null,
        avatar: user?.avatar || null,
        email: user?.email || null,
        phone: user?.phone || null,
        followers_count: 0,
        following_count: 0,
        alerts_count: Number(alertCount) || 0,
    };
}
