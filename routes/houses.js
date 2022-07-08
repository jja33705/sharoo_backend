const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get("/", auth, (req, res) => {
    return res.status(200).json({
        hoseList: [1, 2, 3, 4, 5, 6, 7],
    });
});

module.exports = router;