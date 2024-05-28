// session -> login - register - logout
const { Router } = require("express");
const sessionsRouter = Router();

const { UsersManagerMongo } = require ('../dao/UsersManager.js')
const userService = new UsersManagerMongo()



const { auth } = require ('../middlewares/auth.middleware.js')



sessionsRouter.post('/register', async (req, res) => {
    try {
    const {first_name, last_name, email, password} = req.body

    if (!email || !password) return res.status(401).send({status: 'error', error: 'se necesitan todos los datos'})
    
    const userExist = await userService.getUserBy({email})
    if (userExist ) return res.status(401).send({status: 'error', error: 'el usuario ya existe'})

    const newUser = {
        first_name, 
        last_name, 
        email, 
        password
    }
        
        const result = await userService.createUser(newUser)
        console.log(result)
        res.send({status: 'success', payload: result})
    } catch (error) {
        console.log(error)
    }
})


sessionsRouter.post('/login', async (req, res) => {
    try {
    const { email, password} = req.body

    if (!email || !password) return res.status(401).send({status: 'error', error: 'se necesitan todos los datos'})
    
    const userExist = await userService.getUserBy({email, password})
    if (!userExist ) return res.status(401).send({status: 'error', error: 'credenciales no válidas'})

        req.session.user = {
                    first_name: userExist.first_name,
                    last_name: userExist.last_name,
                    email: userExist.email,
                    admin: userExist.role === 'admin'
                }
                // console.log(req.session.user)
                res.send({status: 'success', payload: req.user})
    } catch (error) {
        console.log(error)
    }
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


// sessionsRouter.post('/failregister', async (req, res) => {
//     console.log('falló la estrategia')
//     res.send({error: 'failed'})
// })

// sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}),async (req, res) => {
//     if(!req.user) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
//     req.session.user = {
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
        
//         email: req.user.email
//     }
//     res.send({status: 'succes', payload: req.user})
// })

// sessionsRouter.post('/faillogin', (req, res) => {
//     res.send({error: 'falló el login'})
// })


