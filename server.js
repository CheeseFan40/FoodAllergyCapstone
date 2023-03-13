if (process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

// Required Modules
const prompt=require("prompt-sync")({sigint:true});
const mongoose = require('mongoose');
const express = require('express')

const app = express()
const port = 3000
const Schema = mongoose.Schema;


const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


// Set Up the Database connection
mongoose.connect("mongodb+srv://MitchZ:T2GRPvC0AkjRuDL8@cluster0.edbmsue.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('MongoDB Connection Established!')

}).catch((err) => {
    console.log(err)
});
  
// Defining User schema
const userSchema = new Schema(
    {RestaurantName: String, Milk: Array, Peanuts: Array, Soy: Array, Wheat: Array, Eggs: Array, Treetnut: Array, Shellfish: Array, Sesame: Array, Fish: Array }
)

  
// Defining User model
const User = mongoose.model('User', userSchema);
  

// Create collection of Model
User.createCollection().then(function (collection) {
    console.log('Collection is created!');
});



//Sets empty array
const usrs = []

//Creates and authenticates password
const createPassport = require('./passportConfig')//exported as initialized
createPassport(
    passport,
    email => usrs.find(user => user.email === email),
    id => usrs.find(user => user.id === id)
)//initialized function that is initialize(passport, getUserByEmail, getUserById)


//looks for the ejs file in the view folder
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
//to send warnings that the password is incorrect
app.use(flash())
//used to save info on the server
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

//Calls from passportConfig.js
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//Checks the name with what is visible
app.get('/', checkAuthenticated, (req, res) => { 
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

//Uses post to login and send to index.ejs
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
//Gets and posts register page, requires email
app.get('/register', checkNotAuthenticated , (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        usrs.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(usrs)
})

//logs usr out
app.delete('logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

//function for verifying
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

//Checks auth and redirects to index.ejs
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


//Accesses the CSS and JS files in the public folder
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/CSS'))
app.use('/js', express.static(__dirname + 'public/JS'))

app.listen(port, () => console.log(`Running on port ${port}`))



// *** RESTAURANT INPUT *** 



var userinput = prompt("Restaurant Name?");

var milkinput = prompt("Milk items?")
var peanutinput = prompt("Peanut items?")
var soyinput = prompt("Soy items?")
var wheatinput = prompt("Wheat items?")
var eggsinput = prompt("Eggs items?")
var treenutinput = prompt("Treenut items?")
var shellfishinput = prompt("Shellfish items?")
var sesameinput = prompt("Sesame items?")
var fishinput = prompt("Fish items?")

//function to see if a current document exists, if it doesn't create 
//a new one according to the restaurant name input
async function tester(){
let exists = await User.exists({RestaurantName: userinput})
console.log(exists)
return exists
}
tester().then(function (collection){
    if(collection){
        console.log("exists")
    }else{
        User.insertMany({RestaurantName: userinput}).then(function () {
            console.log("A new Restaurant has been added");}).catch(function(err) { 
            console.log(err)
        });
    }
})

//comparisons functions for each allergen
async function test2(){
if(milkinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Milk:milkinput}}).then(function(){
    console.log("successfully added milk")
})
.catch(function(err){
    console.log(err)
});
}

if(peanutinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Peanuts:peanutinput}}).then(function(){
    console.log("successfully added peanut")
})
.catch(function(err){
    console.log(err)
});
}

if(soyinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Soy:soyinput}}).then(function(){
    console.log("successfully added Soy item")
})
.catch(function(err){
    console.log(err)
});
}

if(wheatinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Wheat:wheatinput}}).then(function(){
    console.log("successfully added wheat item")
})
.catch(function(err){
    console.log(err)
});
}

if(eggsinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Eggs:eggsinput}}).then(function(){
    console.log("successfully added egg item")
})
.catch(function(err){
    console.log(err)
});
}

if(treenutinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Treetnut:treenutinput}}).then(function(){
    console.log("successfully added treenut item")
})
.catch(function(err){
    console.log(err)
});
}

if(shellfishinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Shellfish:shellfishinput}}).then(function(){
    console.log("successfully added shellfish item")

})
.catch(function(err){
    console.log(err)
});
}

if(sesameinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Sesame:sesameinput}}).then(function(){
    console.log("successfully added sesame item") 
})
.catch(function(err){
    console.log(err)
});
}

if(fishinput != ""){

await User.updateMany({RestaurantName:userinput},{ $push: {Fish:fishinput}}).then(function(){
    console.log("successfully added fish item")
})
.catch(function(err){
    console.log(err)
});
}
}
test2();