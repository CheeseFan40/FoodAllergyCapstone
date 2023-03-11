
// Require the mongoose module
const express = require('express')
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
    { name: String, age: Number, email: String }
)
  
// Defining User model
const User = mongoose.model('User', userSchema);
  
// Create collection of Model
User.createCollection().then(function (collection) {
    console.log('Collection is created!');
});

app.get('/', (req, res) => res.send("Hello World!"))
app.listen(port, () => console.log(`running on port ${port}`))
