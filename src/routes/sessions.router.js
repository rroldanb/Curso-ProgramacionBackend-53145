// session -> login - register - logout
const { Router } = require("express");
const sessionsRouter = Router();

const { UsersManagerMongo } = require ('../dao/UsersManager.js')
const userService = new UsersManagerMongo()


const {createHash, isValidPassword} = require ('../utils/bcrypt.js')
const { auth } = require ('../middlewares/auth.middleware.js');
const { toCapital } = require("../public/js/renderUtils.js");
const passport = require("passport");
const MongoStore = require("connect-mongo");



sessionsRouter.get ('/github', passport.authenticate('github', {scope:'user:email'}), async (req, res)=>{
    // console.log('first')
})
sessionsRouter.get ('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res)=>{
    const user = req.user
    const admin = req.user.role === 'admin'
    req.session.user = {user, admin }
    // console.log('req.session.user ', req.session.user )
    res.redirect('/')
})

// sessionsRouter.post('/register', async (req, res) => {
//     try {
//     const {first_name, last_name, email, password} = req.body

//     if (!email || !password) return res.status(401).send({status: 'error', error: 'se necesitan todos los datos'})
    


//     const userExist = await userService.getUserBy({email})
//     if (userExist ) return res.status(401).send({status: 'error', error: 'el usuario ya existe'})

//     const newUser = {
//         first_name : toCapital(first_name), 
//         last_name : toCapital(last_name) , 
//         email : email.toLowerCase() , 
//         password : createHash(password)
//     }
        
//         const result = await userService.createUser(newUser)
//         // console.log(result)
//         res.send({status: 'success', payload: result})
//     } catch (error) { 
//         console.log(error)
//     }
// })


// sessionsRouter.post('/login', async (req, res) => {
//     try {
//     let { email, password} = req.body

//     if (!email || !password) return res.status(400).send({status: 'error', error: 'se necesitan todos los datos'})
//     email = email.toLowerCase()
//     const userExist = await userService.getUserBy({email})
//     if (!userExist ) return res.status(400).send({status: 'error', error: 'usuario no registrado'})


//     if (!isValidPassword(password, {password: userExist.password}) ) return res.status(401).send({status: 'error', error: 'contraseña no válida'})
//         req.session.user = {
//                     first_name: userExist.first_name,
//                     last_name: userExist.last_name,
//                     email: userExist.email,
//                     admin: userExist.role === 'admin'
//                 }
//                 res.send({status: 'success', payload: req.user})
//     } catch (error) {
//         console.log(error)
//     }
// })

sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), 
async (req, res) => {
    res.send({status: 'success', message: 'User Registered'})

})

sessionsRouter.post('/failregister', async (req, res) => {
    console.log('falló la estrategia')
    res.send({error: 'Register failed'})
})



sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: 'faillogin'}),

async (req, res) => {
    if(!req.user) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        admin: req.user.role === 'admin',
        email: req.user.email
    }
    res.send({status: 'success', payload: req.session.user})
    // res.send({status: 'success'})

})

sessionsRouter.get('/faillogin', (req, res) => {
    console.log('login failed')
    res.send({error: 'Login failed'})
})




sessionsRouter.get('/current', auth, (req, res) => {
    res.send('datos sensibles')
})


sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(err) return res.send({status: 'error', error: err})
        else return res.redirect('/login')
    })
})

sessionsRouter.get('/status', (req, res) => {
    if (req.session.user) {
        res.json({
            isAuthenticated: true,
            isAdmin: req.session.user.admin
        });
    } else {
        res.json({
            isAuthenticated: false,
            isAdmin: false
        });
    }
});



module.exports = { sessionsRouter, }





