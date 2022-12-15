import userRepository from '../../database/repositories/user.repository';

export default async function ({ type, page, limit }) {
    const { count: totalCount, rows: adminCentres } = await userRepository.listCenterUserAdmin({ type, page, limit });
    return {
        centreUserAdminList: adminCentres ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
