import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'Followership',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            hero_uuid: { type: DataTypes.TEXT, allowNull: false },
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
            tableName: 'followerships',
        },
    );
