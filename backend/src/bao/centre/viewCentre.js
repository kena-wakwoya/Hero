import { USERS_TYPE } from '../../config/constants';
import centreRepository from '../../database/repositories/centre.repository';

import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
export default async function ({ domain, user }) {
    const centre = await centreRepository.retrieve({ domain });
    if (
        !centre ||
        ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(user.account_type) === -1 &&
            centre.is_deleted)
    ) {
        throw new ApplicationResponseException('CENTRE_NOT_FOUND', 'Centre not found', 404);
    }
    const { name, address, created_at, is_active, no_of_calls, email, phone, lat, long, zip_code } = centre;
    return { name, address, created_at, domain, is_active, no_of_calls, email, phone, lat, long, zip_code };
}
