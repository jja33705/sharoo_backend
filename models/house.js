const Sequelize = require('sequelize');

class House extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                title: {
                    type: Sequelize.STRING(30),
                    allowNull: false,
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                address: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                point: {
                    type: Sequelize.GEOMETRY('POINT'),
                    allowNull: false,
                },
                kind: {
                    type: Sequelize.CHAR(1),
                    allowNull: false,
                },
                room_count: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                toilet_count: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                area: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                max_people: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                sex: {
                    type: Sequelize.CHAR(1),
                    allowNull: false,
                },
                start_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                end_date: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                ended: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                deposit: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: true,
                },
                monthly_rent: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: true,
                modelName: 'House',
                tableName: 'houses',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }
    static associate(db) {
        db.House.belongsTo(db.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'cascade',
        });
        db.House.hasMany(db.Review, {
            foreignKey: 'house_id',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
        db.House.hasMany(db.Image, {
            foreignKey: 'house_id',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
        db.House.belongsToMany(db.User, {
            foreignKey: 'house_id',
            through: 'interest',
        });
    }
};

module.exports = House;