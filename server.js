// IMPORT ALL NECESSARY LIBRARIES AND TOOLS
const express = require('express');
const app = express();
app.set('view-engine', 'ejs');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
require("dotenv").config()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

var currentKey

const database = require('./database')

//to check database (for personal use in testfase)
app.get('/users', async (req, res) => {
  let users = await database.getAllUsers()
  res.send(users)
})

//show register page
app.get('/register', (req, res) => {
  res.render('register.ejs')
})

//post register data to server
app.post('/register', async (req, res) => {
  //register new user
  let check = await database.registerUser(req.body.name, req.body.password)

  if (check) {
    req.method = 'GET'
    res.render("login.ejs")
  }
  res.sendStatus(200)
})


app.get('/start', authenticateToken, (req, res) => {
  res.render("start.ejs")
})

//show login page
app.get('/', (req, res) => {
  res.redirect("/login")
})

//show login page
app.get('/login', (req, res) => {
  res.render('login.ejs')
})


//post login data to server
app.post('/login', async (req, res) => {
  //login user
  let check = await database.loginUser(req.body.name, req.body.password)
  console.log(check);

  //load proper page
  if (check) {
    //res.render("start.ejs")

    //create token
    currentKey = jwt.sign(req.body.name, process.env.TOKEN)
    console.log(currentKey)
    res.redirect("/start")
  } else {
    currentKey = "";
    req.method = 'GET'
    res.render("fail.ejs")
  }

})

/*
//post login data to server
app.post('/login', async (req, res) => {
  //login user
  let check = await database.loginUser(req.body.name, req.body.password)
  console.log(check);

  //load proper page
  req.method = 'GET'
  if (check) {
    res.render("start.ejs")

    //create token
    const currentToken = jwt.sign(req.body.name, process.env.TOKEN)
    console.log(currentToken)
  } else {
    res.render("fail.ejs")
  }
  //res.sendStatus(200)
})
*/

function authenticateToken(req, res, next) {
  if (currentKey == "") {
    res.redirect("/login")
  } else {
    next()
  }
}



// listening on port 4000
app.listen(4000, () => {
  console.log("Server listening on port: " + 4000);
})
