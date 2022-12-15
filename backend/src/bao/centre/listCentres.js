import centreRepository from '../../database/repositories/centre.repository';

export default async function ({ type, page, limit, search }) {
    const { count: totalCount, rows: centres } = await centreRepository.list({ type, page, limit, search });
    return {
        centres: centres ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
