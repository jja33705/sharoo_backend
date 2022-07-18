const multer = require('multer');
const path = require('path');

const upload = {
    uploadHouseImage: multer({ // 하우스 이미지 저장
        storage: multer.diskStorage({
            destination(req, file, done) {
                done(null, 'uploads/images/house/');
            },
            filename(req, file, done) {
                const ext = path.extname(file.originalname);
                done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
    }),
    uploadProfileImage: multer({ // 프로필 이미지 저장
        storage: multer.diskStorage({
            destination(req, file, done) {
                done(null, 'uploads/images/profile/');
            },
            filename(req, file, done) {
                const ext = path.extname(file.originalname);
                done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
    }),
};

module.exports = upload;