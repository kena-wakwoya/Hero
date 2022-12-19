import { getModels } from '../index';

export default {
    create: (data) => {
        const { UserCentre } = getModels();
        return UserCentre.create(data);
    },
    updateOrCreate: (filter, data, shouldUpdate = false) => {
        const { UserCentre } = getModels();
        if (shouldUpdate) return UserCentre.update(data, { where: filter });
        return UserCentre.create(data);
    },
    retrieve: (filter) => {
        const { UserCentre } = getModels();
        return UserCentre.findOne({ where: filter });
    },
    getAdminOfCentre: (centreId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { _sequelize } = getModels();
                const query = `SELECT
    users.id AS id
FROM
    user_centres
JOIN users ON user_centres.user_id = users.id
WHERE
    users.account_type = 'centre_admin' AND user_centres.centre_id = ${centreId}
AND
    users.status = 'active'
LIMIT 1`;
                const [[users]] = await Promise.all([_sequelize.query(`${query}`)]);
                return resolve(users?.[0] || null);
            } catch (error) {
                return reject(error);
            }
        });
    },
};
