const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function initialize(passport, getUserByEmail, getUserByID) {
    const authenticateUser = async (email, password, done) => {
        const user =getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: 'No user registered with that email'}) //checks if email exists.
        }

        try {
            if (await bcrypt.compare(password, user.password)) { //compares password to user password
                return done(null, user) //returns the user of the authentication
            } else {
                return done( null, false, {message: 'This is not the correct password'})
            }
        } catch (e) {
            return done(e)
        }
    }
    
    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id))
    })
}

module.exports = initialize