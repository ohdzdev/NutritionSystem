# ZOO API

🐛 📖 🌎

### Introduction

```**this document is a work in process, please be gentle**```

This Node.js application is the main worker between the MySQL database and any application that might need to interface with the Zoo's nutrition data.

#### How does it work?

As mentioned above, this is a Node.js application using a framework called Loopback made by IBM that serves an Express HTTP server. Loopback has models that are defined and related directly to a table in a MySQL database which Loopback connects to via a mysql connector. For optimal performance, the DB should be in the same network / machine as the API.

#### Why Loopback? 

During the examination of technologies during this project's conception, the team decided that we needed a tool that would support for quick development with an existing database. We wanted to have it focused around Node.js since most of the team had prior experience with this technology. Loopback has an amazing scaffolding CLI system that allows for existing databases to have their schema pulled and then have Loopback models and thus the APIs automatically created for us. In addition, the authentication system was essentially written for us as well, so the only things we had to do was limit access and introduce roles into the system and the system was ready for produciton.

## Development / Deployment

This project utilizes [dotenv](https://www.npmjs.com/package/dotenv), please create a `.env` file in the root of the `zoo_api` folder with values for these params:

``` js
DB_HOST=ip/url
DB_USER=coolUser
DB_PASS=coolPass
DB=dbName
HTTP=true ### set to false if https is desired. can only do one or the other
```

dotenv allows us to keep our connections secure and they won't get overritten during a deploy since they are not tracked by git. 

### PRE-DEPLOYMENT

1. Set up .env file for the API if not done on the production machine in the root folder of this project
2. Working with a blank MySQL database?
    a. use the automigrate feature from Loopback to create the database schema. **TODO: create automigrate script in case want to deploy for some other zoo**
    b. use the `automigrate.js` script under `/server` to create tables for all the user tables needed by Loopback
3. Working with an existing MySQL database? (zoo schema already applied)
    a. Run script on `2b` if haven't already
4. generate some SSL certs via your favorite SSL cert generator and store them in `./zoo_api/server/private/`
    a. private key filename needs to be: `privatekey.pem`
    b. certifacte filename needs to be: `certificate.pem`
    c. `.env` file needs an HTTP attribute set to false in order to run on https

### DEPLOYMENT
Using [PM2](https://www.npmjs.com/package/pm2) - go up to the root directory of the mono-repo and run `pm2 start` this will run 2 instances of the API and 2 instances of the frontend.

Not using PM2 - run `yarn && yarn start` in this directory in order to get an instance running on `http://localhost:3333`

