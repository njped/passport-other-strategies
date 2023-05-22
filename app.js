const express = require('express')
const path = require('path')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const session = require('express-session')

const port = 3000
const app = express()

app.set('views', './views')
app.set("view engine", 'pug')

app.use(session({
  secret: 'asdsafdfsaa',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 6000}
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy( {
  clientID: '814665054024-0t8qldeig7e6vjr9bv46evg6psobrgea.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, 
(accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

const authRouter = express.Router()
app.use('/auth', authRouter);

authRouter.get('/google', passport.authenticate('google', {scope: ['email', 'profile'] })
)

authRouter.get('/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/userDetails',
    failureRedirect: '/'
}))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/userDetails', (req, res) => {
  console.log(req.user);
  res.render('userDetails', {
    user: req.user
  })
})

app.listen(port, () => {
  console.log(`You are listening on port: ${port}`);
})