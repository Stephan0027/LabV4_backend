const jwt = require("jsonwebtoken")
require("dotenv").config()

const database = require('./database')

//specifies which routes need permission and who can access it
const sitePermission = {
  "/start": { "role": ["admin", "teacher", "student"], "user": [] },
  "/admin": { "role": ["admin"], "user": [] },
  "/teacher": { "role": ["admin", "teacher"], "user": [] },
  "/student1": { "role": ["admin", "teacher"], "user": ["id1"] },
  "/student2": { "role": ["admin", "teacher"], "user": ["id2"] }
}


//decodes JWT token
async function decodeToken(token) {
  let userInfo = { "name": "", "role": "", "userID": "" };

  try {
    let decoded = jwt.verify(token, process.env.TOKEN);
    userInfo["name"] = decoded["username"]

    let user = await database.getUser(userInfo["name"])
    userInfo["role"] = user[0]["role"];
    userInfo["userID"] = user[0]["userID"];

  } catch (error) {
    console.log(error)
    userInfo = null;
  }

  return userInfo;
}


//create JWT token
function createToken(load) {
  let token = jwt.sign(load, process.env.TOKEN);
  return token
}


//check route permission
async function checkPermission(orgUrl, token) {

  //user specific route
  if (orgUrl.includes("/users/")) {
    let userInfo = await decodeToken(token);

    if (userInfo === null) {
      return false
    }

    let htmlArray = orgUrl.split("/")
    if (userInfo["userID"] === htmlArray[htmlArray.length - 1]) {
      return true
    } else {
      return false
    }
  }

  //general route that requires permission
  if (Object.keys(sitePermission).includes(orgUrl)) {
    let userInfo = await decodeToken(token);

    //if role specific
    if (sitePermission[orgUrl]["role"].includes(userInfo["role"])) {
      return true
    }

    //if user specific
    if (sitePermission[orgUrl]["user"].includes(userInfo["userID"])) {
      return true
    }

    return false

  }

  //no permission required
  return true

}


module.exports = { createToken, checkPermission }