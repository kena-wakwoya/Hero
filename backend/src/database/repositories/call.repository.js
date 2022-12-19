import { getModels } from '../index';

export default {
    listAllCalls: async ({ page, limit }) => {
        const { Call } = getModels();
        return Call.findAndCountAll({
            order: [['created_at', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit,
            attributes: [
                'id',
                'call_id',
                'start_time',
                'end_time',
                'caller_id',
                'call_type',
                'answer_user_id',
                'status',
                'created_at',
                'updated_at',
            ],
        });
    },
    listInboundCalls: async ({ page, limit }) => {
        const { Call } = getModels();
        return Call.findAndCountAll({
            where: { call_type: 'in_bound' },
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            attributes: [
                'id',
                'call_id',
                'start_time',
                'end_time',
                'caller_id',
                'call_type',
                'answer_user_id',
                'status',
                'created_at',
                'updated_at',
            ],
        });
    },
    listOutboundCalls: async ({ page, limit }) => {
        const { Call } = getModels();
        return Call.findAndCountAll({
            where: { call_type: 'out_bound' },
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            attributes: [
                'id',
                'call_id',
                'start_time',
                'end_time',
                'caller_id',
                'call_type',
                'answer_user_id',
                'status',
                'created_at',
                'updated_at',
            ],
        });
    },

    create: (data) => {
        const { Call } = getModels();
        return Call.create(data);
    },
    retrieve: (filter) => {
        const { Call } = getModels();
        return Call.findOne({ where: filter });
    },
    update: (filter, data) => {
        const { Call } = getModels();
        return Call.update(data, { where: filter });
    },
};
