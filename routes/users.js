const express = require("express");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redisClient = require("../utils/redis");
const { User } = require('../models');
const router = express.Router();

// 회원가입
router.post('/register', async (req, res) => {
    const { name, email, password, age, sex, birthday, phone_number } = req.body;

    // 이미 존재하는 이메일인지 체크
    const user = await User.findOne({
            where: {
            email: email,
        },
    });
    
    // 이미 존재하는 유저일떄
    if (user) { 
        return res.status(400).json({
            message: "이미 존재하는 email입니다.",
        });
    }

    // 패스워드 암호화
    const salt = crypto.randomBytes(64).toString('base64');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 9999, 64, 'sha512').toString('base64');

    const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        salt: salt,
        age: age,
        sex: sex,
        birthday: birthday,
        phone_number: phone_number,
    });
    return res.status(201).json({
        message: "회원가입 성공",
        user: newUser,
    });
});

// 로그인
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 이메일에 해당하는 유저 존재하는지 확인
    const user = await User.findOne({
            where: {
            email: email,
        },
    });
    if (user === null) {
        return res.status(400).json({
            message: "email에 해당하는 유저가 없습니다.",
        });
    }

    // 비밀번호 체크
    hashedPassword = crypto.pbkdf2Sync(password, user.salt, 9999, 64, 'sha512').toString('base64');
    if (hashedPassword != user.password) {
        return res.status(400).json({
            message: "비밀번호가 일치하지 않습니다.",
        });
    }

    // access token 생성
    const payload = {
        id: user.id
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h',
    });

    // refresh token 생성 후 redis에 저장
    const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d',
    });
    await redisClient.set(user.id.toString(), refreshToken);

    // refresh token은 cookie로, access token은 응답으로 보냄
    return res.status(200).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }).json({
        message: '로그인 성공',
        accessToken: accessToken,
        user: user,
    });
});

// access token 재발급
router.post('/refreshToken', async (req, res) => {
    // authorization 헤더 없을 때
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'authorization 헤더 없음',
        });
    }

    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.cookies['refreshToken'];

    // 액세스 토큰, 리프레쉬 토큰 둘 중 하나라도 없을 때
    if (!accessToken || !refreshToken) {
        return res.status(401).json({
            message: 'refreshToken, accessToken 둘 다 있지 않음',
        });
    }

    try {
        // refreshToken 유효기간 확인
        const decodedRefreshToken = jwt.decode(refreshToken);
        if (Date.now() >= decodedRefreshToken.exp * 1000) {
            return res.status(401).json({
                message: 'refreshTokenExpired',
            });
        }

        // refreshToken 대조
        const { id } = jwt.decode(accessToken);
        const refreshTokenSavedInRedis = await redisClient.get(id.toString());
        if (refreshToken != refreshTokenSavedInRedis) {
            return res.status(401).json({
                message: 'refreshToken 이상함',
            });
        }

        // accessToken 새로 발금
        const payload = {
            id: id,
        };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h',
        });
        return res.status(200).json({
            message: 'refresh 성공',
            accessToken: newAccessToken,
        });
    } catch (error) { // refresh token이나 access token 중에 문제 있을 때
        return res.status(401).json({
            message: 'refresh token이나 access token중에 뭔가 이상함. 둘 다일수도'
        });
    }
});

module.exports = router;
