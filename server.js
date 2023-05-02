if (process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

// Required Modules
const mongoose = require('mongoose');
const express = require('express')

const app = express()
const port = 8080
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

 app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});


 app.get('/', (req, res) => {
  res.send('Hello');
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
const usrs2 = []
//var usrs3 = []
const databaseaccount = []
var restaurant = ""

//Creates and authenticates password
const createPassport = require('./passportConfig');//exported as initialized

createPassport(
    passport,
    email => databaseaccount.find(user => user.email === email),
    id => databaseaccount.find(user => user.id === id)
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
app.get('/', (req, res) => { 
    res.render('about.ejs')
})

app.get('/restaurant', (req, res) => { 
    res.render('restaurant-choice.ejs')
})

app.post('/restaurant', (req, res) => { 
    
    var restname = {
        rest: req.body.RestaurantChoice
    }
    res.redirect('/comparisons')
    console.log(restname.rest)
    restaurant = restname.rest
})

app.get('/comparisons-result', (req, res) => {
    res.render('comparisons-result.ejs')
})


app.get('/comparisons', (req, res) => res.render("comparisons.ejs"))

app.post('/comparisons', async function (req, res) {
    try{    
    
        const restarray = {
            test: req.body.RestaurantNamer,
            test1:  req.body.Milk,
            test2 : req.body.Soy,
            test3 :req.body.Peanuts,
            test4: req.body.Wheat,
            test5 :req.body.Eggs,
            test6 :req.body.Treenut,
            test7 : req.body.Shellfish,
            test8 : req.body.Sesame,
            test9 : req.body.Fish
        }
        //console.log(restarray)
        milk = await User.find({RestaurantName:restaurant}).distinct('Milk')
        soy = await User.find({RestaurantName:restaurant}).distinct('Soy')
        peanuts = await User.find({RestaurantName:restaurant}).distinct('Peanuts')
        wheat = await User.find({RestaurantName:restaurant}).distinct('Wheat')
        eggs = await User.find({RestaurantName:restaurant}).distinct('Eggs')
        treenut = await User.find({RestaurantName:restaurant}).distinct('Treenut')
        shellfish = await User.find({RestaurantName:restaurant}).distinct('Shellfish')
        sesame = await User.find({RestaurantName:restaurant}).distinct('Sesame')
        fish = await User.find({RestaurantName:restaurant}).distinct('Fish')
        console.log(milk)

        res.redirect('/comparisons-result')
    }catch{

}
})



app.get('/about', (req, res) => {
    res.render('about.ejs')
})
app.post('/about', async (req, res) => {

    res.render('about.ejs')
    
})

app.get('/account-log-in', checkNotAuthenticated, async (req, res) => {
    usrs2.push({
        id: await (await Accounts.find({}).distinct('ID')).toString(),
        name: await (await Accounts.find({}).distinct('UserName')).toString(),
        email: await (await Accounts.find({}).distinct('Email')).toString(),
        password: await (await Accounts.find({}).distinct('HashedPassword')).toString()
    })
    for(var x in usrs2){
        //console.log(usrs2[x])
    }
    console.log(usrs2[x])
    databaseaccount.push(usrs2[x])
    

    res.render('account-log-in.ejs')
})


// NOT WORKING ??? works now :)
app.get('/account-logged-in', checkAuthenticated, (req, res) => {
    var testname = usrs2.map(arrz => arrz.name)
    testname = [... new Set(testname)]
    res.render('account-logged-in.ejs',{testname})
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
        usrs2.push({
            id: await (await Accounts.find({}).distinct('ID')).toString(),
            email: await (await Accounts.find({}).distinct('Email')).toString(),
            password: await (await Accounts.find({}).distinct('HashedPassword')).toString()
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
            test7 : req.body.Shellfish,
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
    if(restarray.test3 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Peanuts:restarray.test3}}).then(function(){
            console.log(`successfully added ${restarray.test3}`)
    })
    }
    if(restarray.test4 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Wheat:restarray.test4}}).then(function(){
            console.log(`successfully added ${restarray.test4}`)
    })
    }
    if(restarray.test5 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Eggs:restarray.test5}}).then(function(){
            console.log(`successfully added ${restarray.test5}`)
    })
    }
    if(restarray.test6 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Treenut:restarray.test6}}).then(function(){
            console.log(`successfully added ${restarray.test6}`)
    })
    }
    if(restarray.test7 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Shellfish:restarray.test7}}).then(function(){
            console.log(`successfully added ${restarray.test7}`)
    })
    }
    if(restarray.test8 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Sesame:restarray.test8}}).then(function(){
            console.log(`successfully added ${restarray.test8}`)
    })
    }
    if(restarray.test9 != ""){

        await User.updateMany({RestaurantName:restarray.test},{ $push: {Fish:restarray.test9}}).then(function(){
            console.log(`successfully added ${restarray.test9}`)
    })
    }

    res.redirect('/owner')
    } catch{
    res.redirect('/owner')
    
    }
    
    
    
});
