import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'AlertComment',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: { type: DataTypes.TEXT, allowNull: false },
            alert_uuid: { type: DataTypes.TEXT, allowNull: false },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            like_count: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'alert_comments',
        },
    );
