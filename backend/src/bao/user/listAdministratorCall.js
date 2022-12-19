import userRepository from '../../database/repositories/user.repository';

export default async function ({ type, page, limit }) {
    const { count: totalCount, rows: adminCentresCall } = await userRepository.administratorListCall({ type, page, limit });
    return {
        centreUserAdminListCall: adminCentresCall ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
