const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { uploadHouseImage } = require('../middlewares/upload');
const { House, Image } = require('../models');

// 하우스 리스트
router.get('/', async (req, res) => {

});

// 하우스 등록
router.post('/', auth, uploadHouseImage.array('images'), async (req, res) => {
    const { title, description, address, kind, room_count, toilet_count, area, max_people, sex, start_date, end_date, deposit, monthly_rent, lat, lng } = req.body;

    // sequelize point 타입 객체 생성
    const point = { 
        type: 'Point',
        coordinates: [lng, lat], // lng, lat
    }

    const house = await House.create({
        title: title,
        description: description,
        address: address,
        kind: kind,
        room_count: room_count,
        toilet_count: toilet_count,
        area: area,
        max_people: max_people,
        sex: sex,
        start_date,
        end_date: end_date,
        deposit: deposit,
        monthly_rent: monthly_rent,
        point: point,
    });

    // 이미지가 있으면 생성
    if (req.files.length != 0) {
        for (const file of req.files) {
            const image = await Image.create({
                image_path: file.path,
            });
            house.addImage(image)
        }
    }

    return res.status(201).json({
        message: '하우스 등록 성공',
        house: house,
    });
});

module.exports = router;