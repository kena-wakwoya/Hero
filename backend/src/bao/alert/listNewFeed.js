import alertRepository from '../../database/repositories/alert.repository';

export default async function ({ page, limit, user_id: user_id }) {
    const [newFeeds, totalCount] = await alertRepository.listNewFeed(page, limit, user_id);
    const total = JSON.parse(JSON.stringify(totalCount?.[0]?.[0]?.total));
    return {
        newFeeds,
        paginator: {
            page: page,
            limit: limit,
            totalCount: total,
            totalPages: Math.ceil(Number(total) / limit),
        },
    };
}
