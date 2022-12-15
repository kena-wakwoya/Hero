import { getModels } from '../index';

export default {
    getUserCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const countQuery = `SELECT 
            count(*) as total
            FROM alerts
            WHERE user_id = ${userId}`;
                const { _sequelize } = getModels();
                const [[{ total: totalCount }]] = await _sequelize.query(countQuery);
                resolve(totalCount);
            } catch (error) {
                reject(error);
            }
        });
    },
    getUserAlertComment: async ({ userId, commentId }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { _sequelize } = getModels();
                const query = `SELECT * FROM alert_comments WHERE user_id = ${userId} AND uuid = '${commentId}'`;
                const result = await _sequelize.query(query);
                return resolve(result?.[0]?.[0] || null);
            } catch (error) {
                reject(error);
            }
        });
    },
    addComment: async ({ commentUUID, alertId, content, userId }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const incrementCommentCountQuery = `UPDATE alerts SET comment_count = comment_count + 1 WHERE uuid = '${alertId}'`;
                const query = `INSERT INTO alert_comments (uuid, alert_uuid, user_id, content, created_at, updated_at) VALUES ('${commentUUID}', '${alertId}', '${userId}', '${content}', '${transactionDate}', '${transactionDate}')`;
                const { _sequelize } = getModels();
                const result = await _sequelize.query(query);
                if (result[1] > 0) {
                    await _sequelize.query(incrementCommentCountQuery);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    },
    removeComment: async ({ commentId, userId, alertId }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const decrementCommentCountQuery = `UPDATE alerts SET comment_count = comment_count - 1 WHERE uuid = '${alertId}'`;
                const query = `DELETE FROM alert_comments WHERE uuid = '${commentId}' AND user_id = ${userId}`;
                const { _sequelize } = getModels();
                const result = await _sequelize.query(query);
                if (result?.[0]?.affectedRows > 0) {
                    await _sequelize.query(decrementCommentCountQuery);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    },
    registerAlertLike: async ({ alertId, userId }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
                const incrementLikeCountQuery = `UPDATE alerts SET like_count = like_count + 1 WHERE uuid = '${alertId}'`;
                const logLikeQuery = `INSERT INTO alert_likes (alert_uuid,user_id, created_at, updated_at)
                SELECT * FROM (SELECT '${alertId}' AS alert_uuid, ${userId} AS user_id, '${transactionDate}' AS created_at, '${transactionDate}' AS updated_at) AS temp
                WHERE NOT EXISTS (
                    SELECT user_id FROM alert_likes WHERE alert_uuid = '${alertId}' AND user_id = ${userId}
                ) LIMIT 1;`;
                const { _sequelize } = getModels();
                const result = await _sequelize.query(logLikeQuery);
                if (result[1] > 0) {
                    await _sequelize.query(incrementLikeCountQuery);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    },
    unregisterAlertLike: async ({ alertId, userId }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const decrementLikeCountQuery = `UPDATE alerts SET like_count = like_count - 1 WHERE uuid = '${alertId}'`;
                const removelogLikeQuery = `DELETE FROM alert_likes WHERE alert_uuid = '${alertId}' AND user_id = ${userId}`;
                const { _sequelize } = getModels();
                const result = await _sequelize.query(removelogLikeQuery);
                if (result?.[0]?.affectedRows > 0) {
                    await _sequelize.query(decrementLikeCountQuery);
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    },

    listNewFeed: async (page, limit, user_id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const newFeeds = `SELECT alert.* FROM alerts as alert INNER JOIN followerships as followership ON alert.user_id = followership.hero_uuid  WHERE followership.user_id = '${user_id}' ORDER BY alert.created_at DESC  LIMIT ${
                    (page - 1) * limit
                }, ${limit}`;
                const countNewFeed = `SELECT count(*) as total  FROM alerts as alert INNER JOIN followerships as followership ON alert.user_id = followership.hero_uuid  WHERE followership.user_id = '${user_id}' `;
                const { _sequelize } = getModels();
                const result = await Promise.all([_sequelize.query(newFeeds), _sequelize.query(countNewFeed)]);

                return resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },

    listComments: async ({ alertId, page, limit }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { _sequelize } = getModels();
                const mainQuery = `SELECT 
            alert_comments.uuid as id,
            alert_comments.content as content,
            alert_comments.like_count as like_count,
            users.full_name as full_name,
            users.username as username, 
            users.created_at as created_at, 
            users.email as email,
            users.phone as phone,
            users.avatar as avatar,
            users.position as position
            FROM alert_comments
            JOIN users
            ON users.id = alert_comments.user_id
            WHERE alert_comments.alert_uuid = '${alertId}'
            ORDER BY alert_comments.created_at DESC
            LIMIT ${(page - 1) * limit}, ${limit}`;
                let totalCountQuery = `SELECT 
            count(*) as total
            FROM alert_comments 
            WHERE alert_comments.alert_uuid = '${alertId}'`;
                const result = await Promise.all([_sequelize.query(mainQuery), _sequelize.query(totalCountQuery)]);
                let [[comments], [[{ total: totalCount }]]] = result;
                return resolve([comments, Number(totalCount)]);
            } catch (error) {
                return reject(error);
            }
        });
    },
    list: ({ page, limit, search, user, status, mediaType, source }) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { _sequelize } = getModels();
                const commonQ = `SELECT 
            alerts.uuid as id,
            alerts.content_text as content_text,
            alerts.media_type as media_type,
            alerts.media_content as media_content,
            alerts.address as address,
            alerts.lat as lat,
            alerts.long as longitude,
            alerts.tags as tags,
            alerts.like_count as like_count,
            alerts.view_count as view_count,
            alerts.comment_count as comment_count,
            alerts.is_viewer_discretion_advised as is_viewer_discretion_advised,
            users.full_name as full_name,
            users.username as username, 
            users.created_at as created_at, 
            users.email as email,
            users.phone as phone,
            alerts.status as status,
            users.avatar as avatar,
            users.position as position`;
                let startQuery = '';
                let startTotalQuery = '';
                let midQuery = '';
                if (source === 'poster') {
                    startQuery = `${commonQ}
            FROM alerts
            JOIN users
            ON users.id = alerts.user_id `;

                    startTotalQuery = `SELECT 
            count(*) as total
            FROM alerts JOIN users ON users.id = alerts.user_id `;
                    midQuery = ``;
                    if (user)
                        midQuery += `${midQuery.length > 0 ? 'AND' : 'WHERE'} alerts.user_id = '${
                            user.id
                        }' AND alerts.status IN ("${status.join('", "')}")`;
                    if (search)
                        midQuery = `${
                            midQuery.length > 0 ? 'AND' : 'WHERE'
                        } (users.username LIKE '%${search}%' OR users.full_name LIKE '%${search}%' OR users.email LIKE '%${search}%' OR users.phone LIKE '%${search}%' OR alerts.address LIKE '%${search}%' OR alerts.content_text LIKE '%${search}%' OR alerts.tags LIKE '%${search}%') `;
                    if (mediaType)
                        midQuery += `${midQuery.length > 0 ? 'AND' : 'WHERE'} alerts.media_type = '${mediaType}' `;
                }
                if (source === 'liked') {
                    startQuery = `${commonQ}
            FROM alert_likes
            JOIN users
            ON users.id = alert_likes.user_id JOIN alerts ON alerts.uuid = alert_likes.alert_uuid `;

                    startTotalQuery = `SELECT 
            count(*) as total
            FROM alert_likes
            JOIN users
            ON users.id = alert_likes.user_id JOIN alerts ON alerts.uuid = alert_likes.alert_uuid `;
                    midQuery = ``;
                    if (user)
                        midQuery += `${midQuery.length > 0 ? 'AND' : 'WHERE'} alerts.user_id = '${
                            user.id
                        }' AND alerts.status IN ("${status.join('", "')}")`;
                    if (search)
                        midQuery = `${
                            midQuery.length > 0 ? 'AND' : 'WHERE'
                        } (users.username LIKE '%${search}%' OR users.full_name LIKE '%${search}%' OR users.email LIKE '%${search}%' OR users.phone LIKE '%${search}%' OR alerts.address LIKE '%${search}%' OR alerts.content_text LIKE '%${search}%' OR alerts.tags LIKE '%${search}%') `;
                    if (mediaType)
                        midQuery += ` ${midQuery.length > 0 ? 'AND' : 'WHERE'} alerts.media_type = '${mediaType}' `;
                }
                const endQuery = `ORDER BY alerts.created_at DESC
            LIMIT ${(page - 1) * limit}, ${limit}`;
                const result = await Promise.all([
                    _sequelize.query(`${startQuery}${midQuery}${endQuery}`),
                    _sequelize.query(`${startTotalQuery}${midQuery}`),
                ]);
                let [[alerts], [[{ total: totalCount }]]] = result;
                return resolve([alerts, Number(totalCount)]);
            } catch (error) {
                return reject(error);
            }
        });
    },
    update: (filter, data) => {
        const { Alert } = getModels();
        return Alert.update(data, { where: filter });
    },
    retrieve: (filter) => {
        const { Alert } = getModels();
        return Alert.findOne({ where: filter });
    },
    create: (data) => {
        const { Alert } = getModels();
        return Alert.create(data);
    },
};
