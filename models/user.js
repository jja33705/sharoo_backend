const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                sex: {
                    type: Sequelize.CHAR(1),
                    allowNull: false,
                },
                birthday: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                },
                phone_number: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                introduction: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                profile_image: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                salt: {
                    type: Sequelize.STRING(64),
                    allowNull: false,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: true,
                modelName: 'User',
                tableName: 'users',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.User.hasMany(db.House, {
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
    }
};

module.exports = User;