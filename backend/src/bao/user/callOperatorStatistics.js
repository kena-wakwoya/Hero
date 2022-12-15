import userRepository from '../../database/repositories/user.repository';

export default async function ({ type, page, limit }) {
    const { count: totalCount, rows: callOp } = await userRepository.callOperatorStatistics({ type, page, limit });
    return {
        callOperatorStat: callOp ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
