import alertRepository from '../../database/repositories/alert.repository';

export default async function ({ alertId, page, limit }) {
    const [comments, totalCount] = await alertRepository.listComments({ page, limit, alertId });
    return {
        comments: comments ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
