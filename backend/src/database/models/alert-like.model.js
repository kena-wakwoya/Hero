import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'AlertLike',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            alert_uuid: { type: DataTypes.TEXT, allowNull: false },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'alert_likes',
        },
    );
