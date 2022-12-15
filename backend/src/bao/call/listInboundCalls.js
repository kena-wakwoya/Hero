import dotenv from 'dotenv';
import path from 'path';
import callRepository from '../../database/repositories/call.repository';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export default async function ({ page, limit }) {
    const { count: totalCount, rows: inboundCallList } = await callRepository.listInboundCalls({ page, limit });
    return {
        inbooundCallList: inboundCallList ?? [],
        paginator: {
            page: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(Number(totalCount) / limit),
        },
    };
}
