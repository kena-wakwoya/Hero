import { DataTypes } from 'sequelize';
import { MEDIA_TYPE } from '../../config/constants';

export default (sequelize) =>
    sequelize.define(
        'Alert',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: { type: DataTypes.TEXT, allowNull: false },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            content_text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            lat: {
                type: DataTypes.DECIMAL(8, 6),
                allowNull: true,
            },
            long: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: true,
            },
            tags: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            media_type: {
                type: DataTypes.ENUM({
                    values: Object.values(MEDIA_TYPE),
                }),
                allowNull: true,
            },
            media_content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            view_count: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            comment_count: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            like_count: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM({
                    values: ['active', 'archive', 'deleted'],
                }),
                allowNull: false,
                defaultValue: 'active',
            },
            is_viewer_discretion_advised: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'alerts',
        },
    );
