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

## Redovisning Kmom10 JSramver

### Krav 1: Backend
Servern för mitt API är byggt i nodejs och express då jag är bekant med dessa sedan tidigare och gick därför snabbt att få igång en grundläggande server.  Men också eftersom jag använde mig av JavaScript till frontend(react) och det känns väldigt smidigt att ha samma språk på klienten som på servern.
Som databas för mitt API används sqlite3. Valde detta då det är en lättanvänd databas som är enkel att sätta ihop och lätt att flytta/ta backup på då hela databasen ligger på en enda fil. Databasen består av två tabeller, users och portfolio. I users sparas användarens e-postadress tillsammans med lösenord och saldo för kontot. I portfolio sparas namn och antal aktier när en registrerad användare köper eller säljer aktier.

För att spara lösenord i databasen på ett säkert sätt så har jag använt mig av bcryptjs som hashar lösenordet när man skapar en användare och jämför hashen med lösenordet vid inloggning.
Använder sedan jsonwebtoken för att på ett säkert sätt kunna hämta ut och lägga till information i databasen.  
Andra tredjepartsmoduler som används är Cors, för att tillåta klienter att hämta data från mitt api. Morgan används för att få mer urförliga loggar och nodemon används i testmiljön för att automatiskt starta om servern när det görs ändringar i koden.

Router som detta API stödjer:
GET  ”/” : index
GET ”/login/” : index för login
POST ”/login/” : autentiserar användaren mot databasen (kräver att användarnamn och lösenord finns med i bodyn.)
POST ”/order/”: Hämtar användarens portfolio (kräver token, användare)
POST ”/order/buy”: Köper aktier (kräver token, användare, aktiens namn och antal)
PUT “/order/sell”: säljer aktier (kräver token, användare, aktiens namn och antal)
GET ”/register/”: index för register
POST ”/register/”: Skapar en användare (kräver användarnamn och lösenord)
POST ”/user/”: Hämtar användarens kontobalans (Kräver användarnamn och token i headern)
PUT ”/user/account”: Uppdaterar användarens kontobalans (kräver användarnamn, typ: insert/withdraw och token i headern).
