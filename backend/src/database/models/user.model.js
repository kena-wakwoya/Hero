import { DataTypes } from 'sequelize';
import { USERS_TYPE } from '../../config/constants';

export default (sequelize) =>
    sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            full_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            account_type: {
                type: DataTypes.STRING(100),
                allowNull: false,
                defaultValue: USERS_TYPE.HERO,
            },
            phone: {
                type: DataTypes.STRING(50),
                allowNull: true,
                unique: true,
            },
            dob: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: true,
            },
            avatar: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            position: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            actions_required: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM({
                    values: ['invited', 'active', 'deleted'],
                }),
                allowNull: false,
                defaultValue: 'invited',
            },
            follower_count: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
            following_count: {
                type: DataTypes.BIGINT,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'users',
        },
    );
