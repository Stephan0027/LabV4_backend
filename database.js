const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt');

const file = 'sqlite-database'
const db = new sqlite3.Database(file)

//function to retrieve all user data
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Users WHERE role IN ('student','teacher')`, getCallback(reject, resolve))
  })
}

//get userdate of specific login name
async function getUser(name) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Users WHERE name=$name`, { $name: name }, getCallback(reject, resolve))
  })
}

//add a new user with given name and password
async function addUser(userID, name, role, password) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO Users (userID,name,role,password) VALUES ($userID,$name, $role, $password)`,
      { $userID: userID, $name: name, $role: role, $password: password }, getCallback(reject, resolve))
  })
}

// Extracting the callback function from the database functions, allows us to reuse code.
function getCallback(reject, resolve) {
  return (error, rows = null) => {
    if (error) {
      reject(error)  // failed, no data
    } else {
      resolve(rows)  // success
    }
  }
}

//Check login credentials
async function loginUser(name, password) {
  let user = await getUser(name)
  console.log(user)

  let users = await getAllUsers();
  console.log(users);

  //check if user exists
  if (user.length === 0) {
    return false
  }

  //check password
  let dbPassword = user[0]["password"]
  if (await bcrypt.compare(password, dbPassword)) {
    return true
  } else {
    return false
  }

}

//Add new user
async function registerUser(name, role, password) {
  //check if user exists
  let user = await getUser(name)
  if (user.length > 0) {
    return false
  }

  //create userid based on existing ones
  let users = await getAllUsers();
  let userID = "id" + String(users.length + 1)

  //check if user entered correct values
  if (name === '') {
    return false
  }

  if (password === '') {
    return false
  }

  //encrypt password
  dbEncryption = await bcrypt.hash(password, 10)
  await addUser(userID, name, role, dbEncryption)
  return true
}



module.exports = { getAllUsers, loginUser, registerUser }