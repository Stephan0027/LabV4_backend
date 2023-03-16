
### Step 1. CREATE A LOCAL DATABASE
Create a local database by running the script makeDatabase.js.
You can do this by running Node.js in the terminal. 
Enter the command:
- node makeDatabase.js

A sql database file is created (sqlite-database).


### Step 2. CREATE ENV TOKEN VARIABLE
create a .env file in your folder. This will store the TOKEN variable used with the JWT encoding
Create a random key using Node.js in the terminal.
Enter the following commands in your terminal:
- node
- require('crypto').randomBytes(64).toString('hex')

A textstring will be created. You can paste this in the .env file as follows:
TOKEN = 'random-string'



### Step3. RUN LOCAL SERVER
run the local server. Type the following command in the terminal:
- npm run runServer

You can visit the server by browsing to "localhost:1234".


