import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'UserCentre',
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
                references: {
                    model: 'users', // 'fathers' refers to table name
                    key: 'id', // 'id' refers to column name in fathers table
                },
            },
            centre_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'centres', // 'fathers' refers to table name
                    key: 'id', // 'id' refers to column name in fathers table
                },
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'user_centres',
        },
    );
