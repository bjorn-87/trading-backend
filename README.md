[![Build Status](https://travis-ci.org/bjorn-87/trading-backend.svg?branch=master)](https://travis-ci.org/bjorn-87/trading-backend)

## Download and install
### npm install
First download this repo and then run the command.

## Add config.json
Add a config.json file in root folder and choose a random secret password (64chars):

{
    "secret": "password"
}

## Set up the database
Open your terminal and navigate to me-express-backend/db. then run following command:
touch projekt.sqlite
sqlite3 projekt.sqlite
.read migrate.sql
.exit

## npm start
Runs the app in the development mode. Open http://localhost:8383 to view it in the browser.
