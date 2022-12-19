import userRepository from '../../database/repositories/user.repository';

export default async function ({ page, limit, search }) {
    const { count: totalCount, rows: users } = await userRepository.getPlatformAdminList({ page, limit, search });
    return {
        users: users ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
