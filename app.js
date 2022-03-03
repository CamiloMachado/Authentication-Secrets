require('dotenv').config();
const express = require('express');
const bodyPaser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyPaser.urlencoded({
    extended:true
}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


// Rotas Get//
app.get("/", (req, res)=>{
    res.render("home");
});
app.get("/login", (req, res)=>{
    res.render("login");
});
app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/submit", (req, res)=>{
    res.render("submit");
});
app.get("/logout",(req, res)=>{
    res.redirect("/");
});

// Rotas Post //
app.post("/register",(req, res)=>{
    console.log(req.body);
    const newUser = new User ({
            email: req.body.username,
            password: req.body.password
        });
        
        newUser.save((err)=>{
        if(err){
            console.log(err);
        };
        if(!err){
            res.render("secrets");
        };
    });
});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},(err, foundUser)=>{
        if(err){
            console.log(err);
        };

        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        };
    });

});

app.listen(3000, ()=>{
    console.log(`Server is listening on port 3000`);
});