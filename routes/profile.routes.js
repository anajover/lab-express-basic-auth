const router = require("express").Router();

const isLoggedIn = require("../middlewares/isLoggedIn.js")


// GET "/profile/private"
// if (isLoggedIn){
// router.get("/private", (req, res, next) => {
//     res.render("profile/index.hbs")
// })} else {

// router.get("/main", (req, res, next) => {
//     res.render("profile/main.hbs")
// })
// }

router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("profile/index.hbs")
})

router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("profile/main.hbs")
} )

module.exports = router;