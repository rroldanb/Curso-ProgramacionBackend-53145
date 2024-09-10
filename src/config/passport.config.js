const passport = require("passport");
const local = require("passport-local");
const UserDaoMongo = require("../dao/mongo/users.mongo.js");
const CartsDaoMongo = require("../dao/mongo/carts.mongo.js");
const cartsManager = new CartsDaoMongo();

const { createHash, isValidPassword } = require("../utils/bcrypt.js");
const { toCapital } = require("../public/js/renderUtils.js");

const GithubStrategy = require("passport-github2");
const { logger } = require("./logger.config.js");
const { objectConfig } = require("./config.js");

const LocalStrategy = local.Strategy;
const userService = new UserDaoMongo();

const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: objectConfig.git_hub_id,
        clientSecret: objectConfig.git_hub_secret,
        callbackURL: `${objectConfig.app_url}/sessions/githubcallback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = null;
          if (profile.emails && profile.emails.length > 0) {
            email = profile.emails[0].value;
          } else {
            try {
              const response = await fetch(
                "https://api.github.com/user/emails",
                {
                  headers: {
                    Authorization: `token ${accessToken}`,
                  },
                }
              );
              if (!response.ok) {
                throw new Error("Error agregando emails de GitHub");
              }
              const emails = await response.json();
              if (emails && emails.length > 0) {
                email = emails.find((emailObj) => emailObj.primary).email;
              } else {
                throw new Error("No se encontró email primario");
              }
            } catch (error) {
              throw new Error(`Error obteniendo email: ${error.message}`);
            }
          }

          let user = await userService.getUserBy({ email });
          if (!user) {
            let cart_id;
            try {
              cart_id = await cartsManager.createCart();
            } catch (error) {
              throw new Error(`Error creando el carrito: ${error.message}`);
            }
            let newUser = {
              first_name: profile._json.name,
              last_name: profile._json.name,
              email: email,
              password: "",
              cart_id,
            };
            let result;
            try {
              result = await userService.createUser(newUser);
              try {
                await cartsManager.updateCartWithUserId(cart_id, result._id);
              } catch (error) {
                throw new Error(
                  `Error actualizando el carrrito con user ID: ${error.message}`
                );
              }
            } catch (error) {
              throw new Error(`Error creando el usuario: ${error.message}`);
            }

            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          logger.error(`Error: ${error}`);
          return done(error);
        }
      }
    )
  );

  // middleware -> estrategia -> local -> username(email), password
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
          //debo voler aqui para validadr la fecha de la edad
          // if (isNaN(age)) {
          //   logger.error("La edad debe ser un número");
          //   return done(null, false);
          // }
          let userFound = await userService.getUserBy({ email: username });
          if (userFound) {
            logger.error("El usuario ya existe");
            return done(null, false);
          }

          let cart_id;
          try {
            cart_id = await cartsManager.createCart();
          } catch (error) {
            throw new Error(`Error creando el carrito: ${error.message}`);
          }

          let newUser = {
            first_name: toCapital(first_name),
            last_name: toCapital(last_name),
            age,
            //aqui debo agregar la fecha
            email: username.toLowerCase(),
            password: createHash(password),
            cart_id,
          };
          let result;
          try {
            result = await userService.createUser(newUser);

            try {
              await cartsManager.updateCartWithUserId(cart_id, result._id);
            } catch (error) {
              throw new Error(
                `Error actualizando el carrito cpara el user ID: ${error.message}`
              );
            }
          } catch (error) {
            throw new Error(`Error creando el usuario: ${error.message}`);
          }
          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userService.getUserBy({
            email: username.toLowerCase(),
          });
          if (!user) {
            logger.error("Usuario no encontrado");
            return done(null, false);
          }
          const validPassword = isValidPassword(password, {
            password: user.password,
          });
          if (!validPassword) return done(null, false);
          const uid = user._id;
          const newDate = new Date();
          await userService.updateUser(uid, { last_connection: newDate });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  }); // _id-> session

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.getUserBy({ _id: id });
      done(null, user);
    } catch (error) {
      done(error);
    }
  }); // session -> user
};

module.exports = { initializePassport };
