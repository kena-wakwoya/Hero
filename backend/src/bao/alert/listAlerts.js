import alertRepository from '../../database/repositories/alert.repository';

export default async function ({ page, limit, search, user, status, mediaType, source }) {
    const [alerts, totalCount] = await alertRepository.list({ page, limit, search, user, status, mediaType, source });
    return {
        alerts: alerts ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
