import centreRepository from '../../database/repositories/centre.repository';

import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';
export default async function ({ domain }) {
    const centre = await centreRepository.retrieve({ domain });
    if (!centre || centre.is_deleted) {
        throw new ApplicationResponseException('CENTRE_NOT_FOUND', 'Centre not found', 404);
    }
    await centreRepository.update({ domain }, { is_deleted: true, is_active: false });
    return true;
}
