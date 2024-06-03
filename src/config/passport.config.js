const passport = require ('passport')
const local = require ('passport-local')
const { UsersManagerMongo } = require ('../dao/UsersManager.js')
const {createHash, isValidPassword} = require ('../utils/bcrypt.js')
const { toCapital } = require('../public/js/renderUtils.js')

const GithubStrategy = require ('passport-github2')

const LocalStrategy = local.Strategy
const userService = new UsersManagerMongo()

const initializePassport = () => {
 passport.use('github', new GithubStrategy ({
    clientID : 'Iv23li83uP1Agf1X6oSm',
    clientSecret: 'ef057de83cfae601f9aaa3e9052c45fe9622ca5c',
    callbackURL: 'http://localhost:8080/sessions/githubcallback',
    scope: ['user:email']
 }, async (accessToken, refreshToken, profile, done) =>{
    try {

        let email = null;

        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          const response = await fetch('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `token ${accessToken}`
            }
          });
          const emails = await response.json();
          if (emails && emails.length > 0) {
            email = emails.find(emailObj => emailObj.primary).email;
          }
        }

        let user = await userService.getUserBy({email})
        if (!user){
            let newUser = {
                first_name : profile._json.name,
                last_name : profile._json.name,
                email : email,
                password : ''
            }
            let result = await userService.createUser(newUser)
            done(null, result)
        } else {
            done(null, user)
        }
    } catch (error) {
        console.log('error', error)
        return done (error)
    }
 }
) )

    // middleware -> estrategia -> local -> username(email), password
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // req -> body -> passport -> obj Req
        usernameField: 'email'
    }, async( req, username, password, done ) => {
        const { first_name, last_name } = req.body
            try {
                // verificar si existe el usuario
                let userFound = await userService.getUserBy({email: username})
                if(userFound) {
                    console.log('el usuario ya existe')
                    return done(null, false)
                }
                // crear el uusario 
                let newUser = {
                    first_name : toCapital(first_name) ,
                    last_name : toCapital(last_name),
                    email: username.toLowerCase() ,
                    password: createHash(password)
                }
                let result = await userService.createUser(newUser) // _id
                return done(null, result)
            } catch (error) {
                return done('error al registrar el usuario '+error)   
            }
    }))


    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done)=>{
        try {
            const user = await userService.getUserBy({email: username.toLowerCase()})
            if(!user) {
                console.log('usuario no encontrado')
                return done(null, false)
            }
            const validPassword = isValidPassword(password, {password: user.password})
            if(!validPassword) return done(null, false)


            return done(null, user) // req.user // password 
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    }) // _id-> session

    passport.deserializeUser(async(id, done)=>{
        try {
            let user = await userService.getUserBy({_id: id})
            done(null, user)
        } catch (error) {
            done(error)
        }
    }) // session -> user
}

module.exports = {initializePassport}