const { House } = require('../models');

// 하우스를 수정하거나 삭제할 권한이 있는지 체크하는 미들웨어
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