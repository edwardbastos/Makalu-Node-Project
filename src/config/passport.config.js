import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { usersService, cartsService } from "../services/index.js";
import authService from "../services/authService.js";
import config from "./config.js";
import { errorCodes } from "../dictionaries/errorCodes.js";


const initializePassportStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName, email, password } = req.body;
          if (!firstName || !lastName || !email || !password)
            return done(null, false, { message: "Incomplete values" });

          const exists = await usersService.getUserBy({ email });
          if (exists)
            return done(null, false, { message: "User already exists" });

          const hashedPassword = await authService.createHash(password);

          const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
          };

          let cart;
          if (req.cookies["cart"]) {
            cart = req.cookies["cart"];
          } else {
            const cartResult = await cartsService.createCart();
            cart = cartResult.id;
          }
          newUser.cart = cart;

          const result = await usersService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          if (
            email === config.app.ADMIN_EMAIL &&
            password === config.app.ADMIN_PASSWORD
          ) {
            const adminUser = {
              role: "admin",
              id: "0",
              firstName: "admin",
            };
            return done(null, adminUser);
          }

          const user = await usersService.getUserBy({ email });
          if (!user)
            return done(null, false, { message: "Invalid Credentials" });

          const isValidPassword = await authService.validatePassword(
            password,
            user.password
          );
          if (!isValidPassword)
            return done(null, false, { message: "Invalid Credentials" });
          return done(null, user);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          authService.extractAuthToken,
        ]),
        secretOrKey: "jwtSecret",
      },
      async (payload, done) => {
        console.log('JWT Strategy Payload:', payload);
        return done(null, payload);
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.github.CLIENT_ID,
        clientSecret: config.github.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email;

        let user = await usersService.getUserBy({ email });
        if (!user) {
          const newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: "",
            email,
            password: "",
            admin: false,
          };

          // Lógica para crear un carrito aquí, similar a la estrategia de registro local
          const cartResult = await cartsService.createCart();
          newUser.cart = cartResult.id;

          const result = await usersService.createUser(newUser);
          return done(null, result);
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: config.google.CLIENT_ID,
        clientSecret: config.google.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/googlecallback",
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const { _json } = profile;
          const user = await usersService.getUserBy({ email: _json.email });
  
          if (user) {
            console.log("Usuario encontrado en Google:", user);
            return done(null, user);
          } else {
            const newUser = {
              firstName: _json.given_name,
              lastName: _json.family_name,
              email: _json.email,
            };
  
            let cart;
            if (req.cookies && req.cookies["cart"]) {
              cart = req.cookies["cart"];
            } else {
              const cartResult = await cartsService.createCart();
              cart = cartResult.id;
              res.cookie("cart", cart); 
            }        
  
            newUser.cart = cart;
            const result = await usersService.createUser(newUser);
            console.log("Nuevo usuario creado en Google:", result);
            return done(null, result);
          }
        } catch (error) {
          console.error("Error en la estrategia de Google:", error);
          return done(error);
        }
      }
    )
  );
  
};

export default initializePassportStrategies;
