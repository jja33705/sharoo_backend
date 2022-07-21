const { House } = require('../models');

const housePermissionCheck = async (req, res, next) => {
    const house = await House.findByPk(req.params.id);

    if (!house) {
        return res.status(404).json({
            message: '존재하지 않는 하우스입니다.',
        });
    }

    if (house.user_id !== req.id) {
        return res.status(403).json({
            message: '권한이 없는 사용자입니다.',
        });
    }

    next();
};

module.exports = housePermissionCheck;