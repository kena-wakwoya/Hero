import { Op } from 'sequelize';
import { getModels } from '../index';

export default {
    create: (data) => {
        const { Centre } = getModels();
        return Centre.create(data);
    },
    retrieve: (filter) => {
        const { Centre } = getModels();
        return Centre.findOne({ where: filter });
    },
    update: (filter, data) => {
        const { Centre } = getModels();
        return Centre.update(data, { where: filter });
    },
    findOneLeast: (filterArray) => {
        const { Centre } = getModels();
        return Centre.findOne({ $or: filterArray });
    },
    getCentreUsers: async ({ type, page, limit, search, domain }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { _sequelize } = getModels();
                const startQuery = `SELECT 
            centres.name as centre_name,
            centres.domain as centre_domain,
            centres.type as centre_type,
            users.full_name as full_name,
            users.id as id, 
            users.username as username, 
            users.created_at as created_at, 
            users.email as email,
            users.phone as phone,
            users.status as status,
            users.avatar as avatar,
            users.position as position,
            users.account_type as role
            FROM centres
            JOIN user_centres
            ON centres.id = user_centres.centre_id
            JOIN users
            ON users.id = user_centres.user_id `;

                const startTotalQuery = `SELECT 
            count(*) as total
            FROM centres
            JOIN user_centres
            ON centres.id = user_centres.centre_id
            JOIN users
            ON users.id = user_centres.user_id `;

                let midQuery = ``;
                if (domain && !type) midQuery += `WHERE centres.domain = '${domain}' `;
                if (!domain && type) midQuery += `WHERE centres.type = '${type}' `;
                if (search)
                    midQuery = `AND (users.username LIKE '%${search}%' OR users.full_name LIKE '%${search}%' OR users.email LIKE '%${search}%' OR users.phone LIKE '%${search}%' OR centres.name LIKE '%${search}%') `;
                const endQuery = `ORDER BY users.created_at DESC
            LIMIT ${(page - 1) * limit}, ${limit}`;
                const [[users], [[{ total: totalCount }]]] = await Promise.all([
                    _sequelize.query(`${startQuery}${midQuery}${endQuery}`),
                    _sequelize.query(`${startTotalQuery}${midQuery}`),
                ]);
                return resolve([users, Number(totalCount)]);
            } catch (error) {
                return reject(error);
            }
        });
    },
    list: ({ type, page, limit, search }) => {
        let where = {
            type,
        };
        if (search) {
            where = {
                type,
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { domain: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } },
                    { zip_code: { [Op.like]: `%${search}%` } },
                ],
            };
        }
        const { Centre } = getModels();
        return Centre.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            attributes: [
                'name',
                'address',
                'created_at',
                'type',
                'domain',
                'is_active',
                'no_of_calls',
                'email',
                'phone',
                'lat',
                'long',
                'zip_code',
            ],
            where,
        });
    },
};
