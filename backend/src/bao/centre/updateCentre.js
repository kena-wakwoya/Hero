import { USERS_TYPE } from '../../config/constants';
import centreRepository from '../../database/repositories/centre.repository';

import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
export default async function ({ type, email, domain, name, address, phone, long, lat, isActive, zipCode, user }) {
    const centre = await centreRepository.retrieve({ domain });
    if (
        !centre ||
        ([USERS_TYPE.PLATFORM_ADMINISTRATOR, USERS_TYPE.PLATFORM_OWNER].indexOf(user.account_type) === -1 &&
            centre.is_deleted)
    ) {
        throw new ApplicationResponseException('CENTRE_NOT_FOUND', 'Centre not found', 404);
    }
    const update = {};
    if (email) update['email'] = email;
    if (name) update['name'] = name;
    if (address) update['address'] = address;
    if (phone) update['phone'] = phone;
    if (type) update['type'] = type;
    if (long) update['long'] = long;
    if (lat) update['lat'] = lat;
    if (zipCode) update['zip_code'] = zipCode;
    if (typeof isActive === 'boolean') update['is_active'] = isActive;
    await centreRepository.update({ domain }, update);
    return true;
}
