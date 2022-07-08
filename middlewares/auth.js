const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization.split('Bearer ')[1];

    // access token 없을 때
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    // access token 만료 됐을때
    if (Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({
            message: "TokenExpired",
        });
    }

    next();
}

module.exports = auth;