[![Build Status](https://travis-ci.org/bjorn-87/trading-backend.svg?branch=master)](https://travis-ci.org/bjorn-87/trading-backend) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/bjorn-87/trading-backend/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/bjorn-87/trading-backend/?branch=master) [![Code Coverage](https://scrutinizer-ci.com/g/bjorn-87/trading-backend/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/bjorn-87/trading-backend/?branch=master) [![Build Status](https://scrutinizer-ci.com/g/bjorn-87/trading-backend/badges/build.png?b=master)](https://scrutinizer-ci.com/g/bjorn-87/trading-backend/build-status/master)

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
