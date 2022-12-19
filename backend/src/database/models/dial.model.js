import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'Dial',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            dial_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            provider: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'twilio',
            },
            call_details: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            originalUsers: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            includedUsers: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM({
                    values: ['open', 'engaged', 'completed'],
                }),
                allowNull: false,
                defaultValue: 'open',
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'dials',
        },
    );
