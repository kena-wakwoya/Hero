import centreRepository from '../../database/repositories/centre.repository';
import { ApplicationResponseException } from '../../exceptions/ApplicationResponseException';

export default async function ({ type, email, domain, name, address, phone, long, lat, zipCode }) {
    const centre = await centreRepository.retrieve({ domain });
    if (centre) {
        throw new ApplicationResponseException(
            'CENTRE_DOMAIN_EXISTS',
            'A centre with the domain already exists, consider unarchiving it',
            409,
        );
    }
    const { created_at, is_active, no_of_calls } = await centreRepository.create({
        type,
        email,
        domain,
        name,
        address,
        phone,
        long,
        lat,
        zip_code: zipCode,
    });
    return { name, zipCode, address, created_at, domain, is_active, no_of_calls, email, phone, lat, long };
}
