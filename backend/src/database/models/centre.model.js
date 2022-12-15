import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'Centre',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lat: {
                type: DataTypes.DECIMAL(8, 6),
                allowNull: true,
            },
            long: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: true,
            },
            zip_code: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            domain: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            no_of_calls: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'centres',
        },
    );
