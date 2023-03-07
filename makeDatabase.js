// Run this only when wanting to create the database and test records
// run with "node makeDatabase.js" in terminal

const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt');

const file = 'sqlite-database'
const db = new sqlite3.Database(file)

let errors = 0
let dbEncryption
let testUsers = [
  { name: 'user1', role: "student", password: "password", userID: "id1" },
  { name: 'user2', role: "student", password: "password2", userID: "id2" },
  { name: 'user3', role: "teacher", password: "password3", userID: "id3" },
  { name: 'admin', role: "admin", password: "admin", userID: "admin" }
]

//encrypt passwords
async function encrypt() {
  for (user in testUsers) {
    dbEncryption = await bcrypt.hash(testUsers[user]["password"], 10)
    console.log(testUsers[user]["password"], dbEncryption)
    testUsers[user]["password"] = dbEncryption

  }
}

//create database
async function createDataBase() {
  //encrypt
  for (user in testUsers) {
    dbEncryption = await bcrypt.hash(testUsers[user]["password"], 10)
    console.log(testUsers[user]["password"], dbEncryption)
    testUsers[user]["password"] = dbEncryption

  }

  //create database
  db.serialize(() => {
    db.run(`
  CREATE TABLE Users (
    userID TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    password TEXT NOT NULL
  )`, {}, error => { errors++ })

    for (user of testUsers) {
      console.log(user)
      db.run(
        `INSERT INTO Users (userID,name,role,password) VALUES ($userID,$name, $role, $password)`,
        { $userID: user["userID"], $name: user["name"], $role: user["role"], $password: user["password"] },
        error => { errors++ }
      )
    }
  })
}

createDataBase()



