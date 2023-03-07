// IMPORT ALL NECESSARY LIBRARIES AND TOOLS
const express = require('express');
const app = express();
app.set('view-engine', 'ejs');
const bcrypt = require('bcrypt');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const database = require('./database');
const auth = require('./authentication');


//General variables
const portNr = 1234;
let currentToken;
let currentUserInfo;

//show register page
app.get('/register', (req, res) => {
  res.render('register.ejs');
})

//post register data to server
app.post('/register', async (req, res) => {
  //register new user
  let check = await database.registerUser(req.body.name, req.body.password, req.body.role);

  if (check) {
    console.log("new user created!");
    res.statusCode = 200;
    res.redirect("/identify");
  }
})


//LOGIN routes
//____________________________________________________________________________________________________________________________


//show login page
app.get('/', (req, res) => {
  res.redirect("/identify");
})


//show login page
app.get('/identify', (req, res) => {
  res.render('identify.ejs');
})


//post login data to server
app.post('/identify', async (req, res) => {
  //chek login user credentials
  let username = req.body.name;
  let password = req.body.password;
  let check = await database.loginUser(username, password);

  //login succes
  if (check) {
    //create token
    currentToken = auth.createToken({ username });

    //get userid 
    let userInfo = await database.getUser(username);
    currentUserInfo = { "name": username, "userID": userInfo[0]["userID"] };

    res.statusCode = 200;
    res.redirect("/users/" + userInfo[0]["userID"]);


    //login fail
  } else {
    currentToken = null;
    currentUserInfo = { "name": "", "userID": "" };
    res.statusCode = 401;
    res.render('fail.ejs');
  }

})

//Middleware function
//____________________________________________________________________________________________________________________________

//middleware function to check permission
async function authenticateToken(req, res, next) {
  let orgUrl = req.originalUrl;
  let check = await auth.checkPermission(orgUrl, currentToken);

  if (check) {
    console.log(orgUrl, "permission granted!");
    next()
  } else {
    console.log(orgUrl, "permission denied!");
    res.statusCode = 401;
    res.redirect("/identify");
  }
}

//use middleware function for every request
app.use(authenticateToken);


//CONTENT routes
//____________________________________________________________________________________________________________________________

//general start page (login required)
app.get('/start', (req, res) => {
  res.render("start.ejs", { userid: currentUserInfo["userID"] });
})


//admin page (login required)
app.get('/admin', (req, res) => {
  res.render("admin.ejs");
})


//teacher page (login required)
app.get('/teacher', (req, res) => {
  res.render("teacher.ejs");
})

//student1 page (login required)
app.get('/student1', (req, res) => {
  res.render("student1.ejs");
})

//student2 page (login required)
app.get('/student2', (req, res) => {
  res.render("student2.ejs");
})


//personal start page (login required)
app.get("/users/:userid", function (req, res) {
  let userID = req.params.userid;
  res.render("user.ejs", { name: currentUserInfo["name"], userid: userID });
});


//listening on specified portnumber
app.listen(portNr, () => {
  console.log("Server listening on port: " + portNr);
})
