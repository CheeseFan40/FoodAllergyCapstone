// Require the mongoose module
const prompt=require("prompt-sync")({sigint:true});
const express = require('express');
const mongoose = require('mongoose');
const app = express()
const port = 3000
const Schema = mongoose.Schema;


  
// Set Up the Database connection
mongoose.connect("mongodb+srv://AlexM:gp0RAeekxy72CmVG@cluster0.edbmsue.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('Connection Established')
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

app.get('/', (req, res) => res.send("Hello World!"))
app.listen(port, () => console.log(`running on port ${port}`))
