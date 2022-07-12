const Sequelize = require('sequelize');

class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                score: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                description: {
                    type: Sequelize.TEXT,
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
                modelName: 'Review',
                tableName: 'reviews',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }

    static associate(db) {
        db.Review.belongsTo(db.User, {
            foreignKey: 'writer_id',
            targetKey: 'id',
            onDelete: 'cascade',
        });
        db.Review.belongsTo(db.User, {
            foreignKey: 'target_id',
            targetKey: 'id',
            onDelete: 'cascade',
        });
        db.Review.belongsTo(db.House, {
            foreignKey: 'house_id',
            targetKey: 'id',
            onDelete: 'cascade',
        });
    }
};

module.exports = Review;