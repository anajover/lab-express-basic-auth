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
    const foundUser = await UserModel.findOne( {username: username} )
    console.log(foundUser)
    if (foundUser !== null) {
        res.render("auth/signup", {
            errorMessage: "El usuario ya está registrado."
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

    res.redirect("/auth/login")

}
catch(err) {
    next(err)
}
})

// GET "/auth/login"
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// POST "/auth/login"

router.post("/login", async (req, res, next) => {

    const { username, password } = req.body

    // Campos no pueden estar vacíos.
    if (!username || !password) {
        res.render("auth/login", {
            errorMessage: "¡Debes rellenar todos los campos!"
        })
        return;
    }

    try {

        // Validar que el usuario exista en mi DB.
        const userExists = await UserModel.findOne( {username: username} )
        if (!userExists) {
            res.render("auth/login", {
                errorMessage: "El usuario no existe en la base de datos."
            })
            return;
        }

        // Validar que el password que se introduce es el mismo que el que estaba guardado.
        const passwordCheck = await bcryptjs.compare(password, userExists.password)
        if (!passwordCheck) {
            res.render("auth/login", {
                errorMessage: "La contraseña introducida no es válida."
            })
            return;
        }

        // Con esto, crearemos una nueva sesión para el usuario.
        console.log(req.session.user);
        req.session.user = userExists;

        if (req.session.user === true) {
            res.redirect("/profile/private")
        } else {
            res.redirect("/profile/main")
        }


        //! req.app.locals ES ALGO PREDEFINIDO y es donde GUARDAMOS LAS VARIABLES GLOBALES.
        req.app.locals.userSessionActive = true;

        // Redireccionamos al perfil al loguearnos...

        res.redirect("/profile/private")

    }

    catch(err){
        next(err)
    }

    // POST "/auth/logout"
    // cerrar sesion del usuario
    router.post("/logout", (req, res, next) => {

        // se cierra sesion
        req.session.destroy()
        req.app.locals.userSessionActive = false;

        // redireccionamos al usuario
        res.redirect("/")
    })

})






module.exports = router;