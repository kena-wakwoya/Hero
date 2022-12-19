import { getModels } from '../index';
import { Op } from 'sequelize';
import { USERS_TYPE } from '../../config/constants';

const baseSearch = (search) => {
    return {
        [Op.or]: [
            { full_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { username: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
        ],
    };
};

export default {
    unFollowHero: async ({ id: hero_id, user_id: user_id }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { User, Followership } = getModels();

                await Promise.all([
                    Followership.destroy({
                        where: {
                            hero_uuid: hero_id,
                            user_id: user_id,
                        },
                    }),
                    User.update(
                        {
                            following_count: -1,
                        },
                        {
                            where: { id: user_id },
                        },
                    ),
                    User.update(
                        {
                            follower_count: +1,
                        },
                        {
                            where: { id: hero_id },
                        },
                    ),
                ]);

                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    },
    followHero: async ({ id: id, user: user }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const { User, Followership } = getModels();
                const result = await Promise.all([
                    Followership.create({
                        hero_uuid: id,
                        user_id: user,
                        created_at: transactionDate,
                        updated_at: transactionDate,
                    }),
                    User.update(
                        {
                            following_count: +1,
                        },
                        {
                            where: { id: user },
                        },
                    ),
                    User.update(
                        {
                            follower_count: +1,
                        },
                        {
                            where: { id: id },
                        },
                    ),
                ]);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },
    removeFollower: async ({ hero_id: hero_id, user_id: user_id }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { User, Followership } = getModels();
                await Promise.all([
                    Followership.destroy({
                        where: {
                            hero_uuid: hero_id,
                            user_id: user_id,
                        },
                    }),
                    User.update(
                        {
                            following_count: -1,
                        },
                        {
                            where: {
                                id: user_id,
                            },
                        },
                    ),
                    User.update(
                        {
                            follower_count: -1,
                        },
                        {
                            where: {
                                id: hero_id,
                            },
                        },
                    ),
                ]);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    },

    checkUsername: (username) => {
        const { User } = getModels();
        return User.findOne({ where: { username: username } });
    },
    create: (data) => {
        const { User } = getModels();
        return User.create(data);
    },
    findOneLeast: (filterArray) => {
        const { User } = getModels();
        return User.findOne({ $or: filterArray });
    },
    retrieve: (filter) => {
        const { User } = getModels();
        return User.findOne({ where: filter });
    },
    update: (filter, data) => {
        const { User } = getModels();
        return User.update(data, { where: filter });
    },
    checkIfEmailAssociatedWithPhone: (email, phone) => {
        const { User } = getModels();
        return User.findOne({ where: { email, phone: { [Op.not]: phone } } });
    },
    checkFollowers: (filter) => {
        const { Followership } = getModels();
        return Followership.findOne({ where: filter });
    },
    administratorListCall: ({ page, limit }) => {
        const { User } = getModels();
        return User.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                account_type: USERS_TYPE.CENTRE_ADMIN,
            },
        });
    },
    generateDashboardStats: async ({ call_date, alert_date, hero_date, trending_date }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { Call, Alert, User } = getModels();
                const { _sequelize } = getModels();
                const query = `SELECT tags,count(*) as count FROM alerts where created_at like '${trending_date}%' group by tags order by count desc limit 4`;

                const stats = await Promise.all([
                    Call.count({
                        where: {
                            created_at: {
                                [Op.substring]: `${call_date}`,
                            },
                        },
                    }),
                    Alert.count({
                        where: {
                            created_at: {
                                [Op.substring]: `${alert_date}`,
                            },
                        },
                    }),
                    User.count({
                        where: {
                            created_at: {
                                [Op.substring]: `${hero_date}`,
                            },
                        },
                    }),
                    _sequelize.query(query),
                ]);
                resolve(stats);
            } catch (error) {
                reject(error);
            }
        });
    },
    callOperatorStatistics: ({ page, limit }) => {
        const { User } = getModels();
        return User.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                account_type: USERS_TYPE.CENTRE_OPERATOR,
            },
        });
    },
    listCenterUserAdmin: ({ page, limit }) => {
        const { User } = getModels();
        return User.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                account_type: {
                    [Op.in]: [USERS_TYPE.CENTRE_ADMIN, USERS_TYPE.CENTRE_OPERATOR],
                },
            },
        });
    },
    getPlatformAdminList: ({ page, limit, search }) => {
        const baseCheck = {
            account_type: {
                [Op.in]: [USERS_TYPE.PLATFORM_OWNER, USERS_TYPE.PLATFORM_ADMINISTRATOR],
            },
        };
        let where = baseCheck;
        if (search) {
            where = {
                ...baseCheck,
                ...baseSearch(search),
            };
        }
        const { User } = getModels();
        return User.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'full_name', 'username', 'created_at', 'email', 'phone', 'status', 'avatar', 'position'],
            where,
        });
    },
    getHeroesList: ({ page, limit, search }) => {
        let where = { account_type: USERS_TYPE.HERO };
        if (search) {
            where = {
                account_type: USERS_TYPE.HERO,
                ...baseSearch(search),
            };
        }
        const { User } = getModels();
        return User.findAndCountAll({
            offset: (page - 1) * limit,
            limit: limit,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'full_name', 'username', 'created_at', 'email', 'phone', 'status', 'avatar', 'position'],
            where,
        });
    },
};
