const express = require('express');
const fs = require('fs');
const router = express.Router();
const jwtAuthentication = require('../middlewares/jwtAuthentication');
const housePermissionCheck = require('../middlewares/housePermission');
const { uploadHouseImage } = require('../middlewares/upload');
const { House, Image, User } = require('../models');

// 하우스 한개 조회
router.get('/:id', async (req, res) => {
    const house = await House.findByPk(req.params.id);

    // 조건에 맞는 하우스가 없을 때
    if (!house) {
        return res.status(204).json({
            message: '조건에 맞는 하우스가 없습니다.',
        });
    }

    return res.status(200).json({
        message: '하우스 조회 성공',
        house: house,
    });
});

// 하우스 리스트
router.get('/', async (req, res) => {
    const { page, search, kind } = req.query;

    // 페이지 없으면 1로 설정해주기
    if (!page) {
        page = 1
    }

    const houses = await House.findAll({ // 14개씩 페이지네이션
        limit: 14,
        offset: 14 * (page - 1),
        include: [{
            model: Image,
        }],
        order: [
            [
                'created_at',
                'DESC',
            ],
        ],
    });

    // 조건에 맞는 하우스가 없을 때
    if (houses.length === 0) {
        return res.status(204).json({
            message: '조건에 맞는 하우스가 없습니다.',
        });
    }

    return res.status(200).json({
        houses: houses,
    });
});

// 하우스 등록
router.post('/', jwtAuthentication, uploadHouseImage.array('images'), async (req, res) => {
    const { title, description, address, kind, room_count, toilet_count, area, max_people, sex, start_date, end_date, deposit, monthly_rent, lat, lng } = req.body;

    const user = await User.findByPk(req.id);

    // sequelize point 타입 객체 생성
    const point = { 
        type: 'Point',
        coordinates: [lng, lat],
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
        start_date: start_date,
        end_date: end_date,
        deposit: deposit,
        monthly_rent: monthly_rent,
        point: point,
    });
    await user.addHouse(house);

    // 이미지가 있으면 생성
    if (req.files.length != 0) {
        for (const file of req.files) {
            const image = await Image.create({
                image_path: file.path,
            });
            await house.addImage(image);
        }
    }

    return res.status(201).json({
        message: '하우스 등록 성공',
        house: house,
    });
});

// 하우스 수정
router.put('/:id', jwtAuthentication, housePermissionCheck, uploadHouseImage.array('images'), async (req, res) => {
    const { title, description, address, lat, lng, kind, room_count, toilet_count, area, max_people, sex, start_date, end_date, deposit, monthly_rent, deletedImages } = req.body;
    
    const house = await House.findByPk(req.params.id);

    // 프론트엔드에서 삭제 요청한 이미지 삭제
    if (deletedImages) {
        if (Array.isArray(deletedImages)) { // 삭제 요청한 이미지가 여러개여서 배열일 경우
            for (const deletedImage of deletedImages) {
                const image = await Image.findByPk(deletedImage);
                fs.unlinkSync(image.image_path);
                await Image.destroy({
                    where: {
                        id: image.id,
                    },
                });
            }
        } else { // 삭제 요청한 이미지가 한개일 경우
            const image = await Image.findByPk(deletedImages)
            fs.unlinkSync(image.image_path);
            await Image.destroy({
                where: {
                    id: image.id,
                },
            });
        }
    }

    // 새로운 이미지가 있으면 생성
    if (req.files.length != 0) {
        for (const file of req.files) {
            const image = await Image.create({
                image_path: file.path,
            });
            await house.addImage(image);
        }
    }

    // sequelize point 타입 객체 생성
    const point = { 
        type: 'Point',
        coordinates: [lng, lat],
    }

    await House.update({
        title: title,
        description: description,
        address: address,
        kind: kind,
        room_count: room_count,
        toilet_count: toilet_count,
        area: area,
        max_people: max_people,
        sex: sex,
        start_date: start_date,
        end_date: end_date,
        deposit: deposit,
        monthly_rent: monthly_rent,
        point: point,
    }, {
        where: {
            id: req.params.id,
        },
    });

    return res.status(200).json({
        message: '하우스 정보 수정 완료',
    });
});

// 하우스 삭제
router.delete('/:id', jwtAuthentication, housePermissionCheck, async (req, res) => {
    const images = await Image.findAll({
        where: {
            house_id: req.params.id,
        },
    });

    // 이미지가 있으면 먼저 제거
    if (images.length > 0) {
        for (const image of images) {
            fs.unlinkSync(image.image_path);
            await Image.destroy({
                where: {
                    id: image.id,
                },
            });
        }
    }

    await House.destroy({
        where: {
            id: req.params.id,
        },
    });
    
    return res.status(200).json({
        message: '하우스 삭제 성공',
    });
});

module.exports = router;