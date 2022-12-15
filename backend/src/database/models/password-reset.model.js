import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'PasswordReset',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            code: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'password_resets',
        },
    );
