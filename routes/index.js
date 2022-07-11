const express = require("express");
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send("가나다라");
});

module.exports = router;