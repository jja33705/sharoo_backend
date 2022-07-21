const jwt = require('jsonwebtoken');

const jwtAuthentication = (req, res, next) => {
    // authorization header 없을 때
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: "authorization 헤더 없음",
        });
    }
    
    const token = req.headers.authorization.split('Bearer ')[1];

    // access token 없을 때
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try {
        const decoded = jwt.decode(token, process.env.JWT_SECRET);

        // access token 만료 됐을때
        if (Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({
                message: "TokenExpired",
            });
        }

        // req에 유저 아이디 추가하고 원래 요청으로 이동
        req.id = decoded.id;
        next();
    } catch(error) { // jwt decode하다가 문제 발생했을 때
        return res.status(401).json({
            message: "token 이상함",
        });
    }
}

module.exports = jwtAuthentication;