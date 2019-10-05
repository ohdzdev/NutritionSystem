# Omaha Henry Doorly Zoo Nutrition Platform

🦍 🦏 🍖 🍌

### ABOUT

This repository is a collection of smaller projects that encompass the new OHDZ nutrition system contracted as a Capstone project for UNO's Spring 2019 semester. Each smaller project has detailed installation instructions and this file will be an overview file for anyone who might need to make changes to the project.

### INSTALLATION

#### Server Requirements

* Linux flavor of choice
* npm
* nodejs
* mysql
* nginx
* git
* yarn
* pm2

#### Server setup

##### packages, user creation, and cloning repository
* install required packages / libraries
  1. nodejs (npm should install with nodejs)
  2. mysql
  3. nginx
  4. yarn
  5. git
  6. pm2 via `npm install -g pm2`
* create a new user with generic user perms (do not give admin rights)
* switch to that new user and create a new folder called `zooProd` or something that makes sense
* cd into the directory and then `git clone` this repository via something like this: `git clone http://www.google.com/ .` make sure to include the period to clone directly into this new folder
* Run `yarn` once cloning is done. This installs all necessary packages for the API and the frontend.

##### mysql server setup
* If running a blank mysql server without any previous customer data:
  1. create new mysql database named whatever you want it. `zoo` suggested.
  2. create a new user that will be your remote / local user
  3. copy these settings into the `zoo_api` folder by creating a `.env` file with this inside (relevant info of course)
  ``` js
  DB_HOST=ip/url
  DB_USER=coolUser
  DB_PASS=coolPass
  DB=dbName
  HTTP=true ### set to false if https is desired. can only do one or the other
  ```
  4. Run `automigrate.js` using `node automigrate.js` under `zoo_api/server` This will create the sql tables from the Loopback models.
  5. uncomment user / original roles in `zoo_api/server/boot/authentication.js` to create a generic user on first bootup of the app. After this original bootup you should comment these out again if you don't want this user deleted over and over again.
  6. run the initial boot of the app via `yarn start` in the `zoo_api` folder.
  7. Comment out the piece from step 5.
  8. Copy all stored procedures to server. Stored procedures are located at `zoo_api/lib/Stored Procedures`.
* If using previous customer data from Access **[WIP]**. This requires a manual migration and there is no automated process for this at the time. the DB Migration folder is the only piece that we have left from this. The schema of the new app has changed drastically and will be approached at a later date to work on making that final merge and never look back.

##### Nginx server setup
* Copy `nginx.conf` into the nginx core file. We use a reverse proxy to convert the internal 3000 port to port 80 for the core webserver and port 3333 to 8080 for the API. This could change to whatever is desired (say api.test.com for the API etc)

##### SSL API setup (if running API in HTTPS mode)
* Generate some SSL certs via your favorite SSL cert generator and store them in ./zoo_api/server/private/
    a. private key filename needs to be: privatekey.pem
    b. certifacte filename needs to be: certificate.pem
    c. .env file needs an HTTP attribute set to `false` in order to run on https

#### Frontend API config
* The frontend bundler needs to know what ip address to ping in production to grab all the data from. Currently this sits directly in a tracked git file, but will eventually be moved to a `.env` like the `zoo_api`.
* To set up, change the `process.env.BACKEND_URL` value to the server's external IP address in the `zoo_frontend/env-config.js` file. There is an IP address already there, replace it. (This should be a commit chnage otherwise it will be overwritten every `git pull`).

### STARTUP

* In the root directory after running `git pull` and `yarn` to pull all the latest updates and packages
* Run `deploy.sh` in the root directory. If you can't run it run `chmod 777 ./deploy.sh` to change the perms.

