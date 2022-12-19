import { DataTypes } from 'sequelize';

export default (sequelize) =>
    sequelize.define(
        'Call',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            call_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            caller_id: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            call_type: {
                type: DataTypes.ENUM({
                    values: ['in_bound', 'out_bound'],
                }),
                allowNull: false,
            },
            answer_user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            status: {
                type: DataTypes.ENUM({
                    values: ['active', 'rejected', 'missed', 'recieved'],
                }),
                allowNull: false,
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'calls',
        },
    );
