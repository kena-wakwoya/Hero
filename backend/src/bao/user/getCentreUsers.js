import centreRepository from '../../database/repositories/centre.repository';

export default async function ({ page, limit, search, type, domain }) {
    const [users, totalCount] = await centreRepository.getCentreUsers({ page, limit, search, type, domain });
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
