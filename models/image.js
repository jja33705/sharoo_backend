const Sequelize = require('sequelize');

class Image extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                image_path: {
                    type: Sequelize.STRING,
                    allowNull: false,
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
                modelName: 'Image',
                tableName: 'images',
                paranoid: false,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            },
        );
    }
    static associate(db) {
        db.Image.belongsTo(db.House, {
            foreignKey: 'house_id',
            targetKey: 'id',
            onDelete: 'cascade',
        });
    }
};

module.exports = Image;