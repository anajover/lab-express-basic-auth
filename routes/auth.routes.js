const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const res = require("express/lib/response");

const UserModel = require("../models/User.model.js")

// GET "/auth/signup"
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})


// POST "/auth/signup"
router.post("/signup", async (req, res, next) => {

    console.log(req.body)
    const { username, password} = req.body


// VALIDACION

if (!username || !password) {
    res.render("auth/signup", {
        errorMessage: "Debes rellenar todos los campos"
    })
    return;
}

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
if (passwordRegex.test(password) === false) {
    res.render("auth/signup", {
        errorMessage: "Tu contraseña debe incluir 8 letras, una mayúscula y un número."
    })
    return; //compañia
}

try {
    // VALIDAR SI EL USUARIO ESTA EN LA DB
    const foundUser = await UserModel.findOne({ $or: [{username: username}, {password: password}]})
    console.log(foundUser)
    if (foundUser !== null) {
        res.render("auth/signup", {
            errorMesage: "El usuario ya está registrado."
        })
        return;
    }

    // SI NO ESTA CREARLO EN LA DB

    // encriptar el pass
    const salt = await bcryptjs.genSalt(12)
    const hashPassword = await bcryptjs.hash(password, salt)
    console.log(hashPassword)

    const createdUser = await UserModel.create({
        username,
        password: hashPassword
    })

    res.redirect("/")

}
catch(err) {
    next(err)
}
})







module.exports = router;