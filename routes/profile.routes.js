const router = require("express").Router();

// GET "/profile/index"
router.get("/index", (req, res, next) => {
    res.render("profile/index.hbs")
})

module.exports = router