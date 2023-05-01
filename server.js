if (process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

// Required Modules
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


// Sets up the Database Connection
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


const userSchema2 = new Schema(
  {ID: String, UserName: String, Email: String, HashedPassword: String, Milk: String, Peanuts: String, Soy: String, Wheat: String, Eggs: String, Treenut: String, Shellfish: String, Sesame: String, Fish: String}
)
const Accounts = mongoose.model('accounts',userSchema2)

Accounts.createCollection().then(function (collection){
  console.log('Collection2 is created ')
});



//Sets empty array
const usrs = []

//Creates and authenticates password
const createPassport = require('./passportConfig');//exported as initialized

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


// Checks the name with what is visible
app.get('/', checkAuthenticated, (req, res) => { 
    res.render('index.ejs', {name: req.user.name})
})

app.get('/about', (req, res) => {
    res.render('about.ejs')
})
app.post('/about')

app.get('/account-log-in', checkNotAuthenticated, (req, res) => {
    res.render('account-log-in.ejs')
})


// NOT WORKING ???
app.get('/account-logged-in', (req, res) => {
    res.render('account-logged-in.ejs')
})


//Uses post to login and send to account-logged-in.ejs
app.post('/account-log-in',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/account-logged-in',
    failureRedirect: '/account-log-in',
    failureFlash: true
}))

//Gets and posts register page, requires email
app.get('/account-sign-up', checkNotAuthenticated , (req, res) => {
    res.render('account-sign-up.ejs')
})

//Gets user to sign up properly and redirects back if any field is missing
app.post('/account-sign-up', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        usrs.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        
        console.log(usrs)
        
        const maper = usrs.map(x => x.email)
        const maper2 = usrs.map(x => x.id)
        const maper3 = usrs.map(x => x.name)
        const maper4 = usrs.map(x => x.password)
        let exists=''
        for (let i = 0; i< maper.length; i++){
            console.log(maper[i])
            exists = await Accounts.exists({Email: maper[i]})
            if(!exists){
                Accounts.insertMany({ID: maper2[i], Email: maper[i], HashedPassword: maper4[i], UserName: maper3[i] })
             
                //Accounts.insertMany({HashedPassword: password})
            }else{
                
                console.log("already exists")
    
                
            }
        }

        
        

        res.redirect('/account-log-in')
    } catch {
        res.redirect('/account-sign-up')
    }
    
})

//logs usr out
app.delete('logout', (req, res) => {
    req.logOut()
    res.redirect('/account-log-in')
})

//function for verifying
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/account-log-in')
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
app.use('/images', express.static(__dirname + 'public/Images'))

app.listen(port, () => console.log(`Running on port ${port}`))


app.get('/restaurant-admin', (req, res) => {
    res.render('restaurant-admin.ejs')
})


// ********** RESTAURANT INPUT **********





//function to see if a current document exists, if it doesn't create 
//a new one according to the restaurant name input

app.get('/owner', (req, res) => res.render("owner.ejs"))
app.post('/owner', async function (req, res) {
    try{    
        const restarray = {
            test: req.body.RestaurantNamer,
            test1:  req.body.Milk,
            test2 : req.body.Soy,
            test3 :req.body.Peanuts,
            test4: req.body.Wheat,
            test5 :req.body.Eggs,
            test6 :req.body.Treenut,
            test7 : req.body.Shellfis,
            test8 : req.body.Sesame,
            test9 : req.body.Fish
        }
          
   
        
    let exists = await User.exists({RestaurantName: restarray.test})
    console.log(exists)

    if(!exists){
        console.log("not exist")
        User.insertMany({RestaurantName: restarray.test})
    }else{
        console.log("exists")
    }

    if(restarray.test1 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Milk:restarray.test1}}).then(function(){
             console.log(`successfully added ${restarray.test1}`)
             console.log(restarray.test1)
    })
    }
    if(restarray.test2 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Soy:restarray.test2}}).then(function(){
            console.log(`successfully added ${restarray.test2}`)
    })
    }
    if(test3 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Peanuts:restarray.test3}}).then(function(){
            console.log(`successfully added ${restarray.test3}`)
    })
    }
    if(test4 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Wheat:restarray.test4}}).then(function(){
            console.log(`successfully added ${restarray.test4}`)
    })
    }
    if(test5 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Eggs:restarray.test5}}).then(function(){
            console.log(`successfully added ${restarray.test5}`)
    })
    }
    if(test6 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Treenut:restarray.test6}}).then(function(){
            console.log(`successfully added ${restarray.test6}`)
    })
    }
    if(test7 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Shellfish:restarray.test7}}).then(function(){
            console.log(`successfully added ${restarray.test7}`)
    })
    }
    if(test8 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Sesame:restarray.test8}}).then(function(){
            console.log(`successfully added ${restarray.test8}`)
    })
    }
    if(test9 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Fish:restarray.test9}}).then(function(){
            console.log(`successfully added ${restarray.test9}`)
    })
    }

    res.redirect('/owner')
    } catch{
    res.redirect('/owner')
    
    }
    
    
    
});
