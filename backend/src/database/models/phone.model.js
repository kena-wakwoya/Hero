import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'Phone',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM({
                    values: ['registration', 'login'],
                }),
                allowNull: false,
                defaultValue: 'registration',
            },
            status: {
                type: DataTypes.ENUM({
                    values: ['unknown', 'verified', 'expired'],
                }),
                allowNull: false,
                defaultValue: 'unknown',
            },
            code: {
                type: DataTypes.STRING(4),
                allowNull: true,
            },
            otherId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'phones',
        },
    );
