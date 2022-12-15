import dotenv from 'dotenv';
import path from 'path';
import callRepository from '../../database/repositories/call.repository';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ page, limit }) {
    const { count: totalCount, rows: callLists } = await callRepository.listAllCalls({ page, limit });
    return {
        callLists: callLists ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
