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

####Router som detta API stödjer:
* `GET  ”/”` : index
* `GET ”/login/”` : index för login
* `POST ”/login/”` : autentiserar användaren mot databasen (kräver att användarnamn och lösenord finns med i bodyn.)
* `POST ”/order/”`: Hämtar användarens portfolio (kräver token, användare)
* `POST ”/order/buy”`: Köper aktier (kräver token, användare, aktiens namn och antal)
* `PUT “/order/sell”`: säljer aktier (kräver token, användare, aktiens namn och antal)
* `GET ”/register/”`: index för register
* `POST ”/register/”`: Skapar en användare (kräver användarnamn och lösenord)
* `POST ”/user/”`: Hämtar användarens kontobalans (Kräver användarnamn och token i headern)
* `PUT ”/user/account”`: Uppdaterar användarens kontobalans (kräver användarnamn, typ: insert/withdraw och token i headern).

### Krav 3: Realtid
Använt micro-servicen socket.io för att skicka realtidsdata mellan server och klienten. Detta då det är ett bra verktyg som är lätt att implementera i både server och klient och med väldigt bra dokumentation tillgänglig.
Som aktier används lakritssorterna Salt sill och skolkrita.
Priserna sparas inte i någon databas då jag inte lyckades få historik att visas i klientens graf.
Har istället skapat en fil under models/stock där aktierna och funktionerna för att räkna ut priset finns. Använde exemplet från kursen men har justerat rate och variance för att priserna inte ska dra iväg alltför mycket. Har även implementerat en enkel if-sats som håller priset ovanför 0 genom att sätta startingpoint till variance om priset går under 0.
Så fort en klient ansluter sig mot servern så skickas aktierna ut genom en emit, detta för att klienten snabbt ska få data och rita ut graferna. Eftersom prishistoriken inte sparas så har jag valt att uppdatera grafen och priserna på aktierna varje sekund för att få en bättre grafisk presentation av datat på klienten. För att få dett att fungera används en setInterval-funktion i servern som justerar priserna och sedan skickar data till alla anslutna klienter genom websockets. Men även om ingen klient är ansluten så uppdateras priserna varje sekund så länge servern är igång.
Tycker att det fungerar väldigt bra att skicka websockets mellan server och klient med hjälp av socket.io. Har inte haft några problem alls och tycker att det är ett riktigt bra alternativ för att använda till min trading-sida då det med enkelhet skickar data kontenuerligt till alla klienter som ansluter.


### Krav 4: Tester backend
Har prioriterat kodtäckning när jag skapat mina tester och har därför inte gjort några avancerade testcase där jag testat alla möjliga utfall.
Testerna utförs med verktygen mocha och chai som är installerade med hjälp av npm. Använder dessa då det är enkelt att implementera i koden och alla asserts är väldigt läsbara. Ett exempel är ”res.body.should.be.equal.to” som nästan är skrivet i klartext vad den kollar.
Innan själva testerna görs så skapas en test-databas för att inte påverka produktionsdatabasen, detta görs genom ett bashscript.
Använder sedan chaiHttp i testet för att starta upp en testserver och på så sätt behöver inte servern vara igång för att testerna ska köras.
Alla tester körs genom kommandot `npm test` där även verktyget nyc används för att skapa filer med kodtäckning som sparas i mappen coverage. Efter testscriptet körts valideras koden med hjälp av eslint och eslint-plugin-react.

Kodtäckningen landade på 85% och jag tyckte att det var ganska enkelt att få den siffran. Var några if-satser i databasfunktionerna som jag inte lyckades testa och de flesta funktionerna i middleware filen och dessa bidrar till att dra ner totalen.
Då jag implementerade socket.io i backend istället för att skapa en egen server så var jag tvungen att exkludera setInterval funktionen då testerna inte gick att genomföra annars och detta medför även att totala kodtäckningen dras ner.
Min CI kedja för mitt backend API består av travis och scrutinizer då det är väldigt smidigt att båda dessa checkar ut mitt repo från github och kör testerna varje gång jag pushar upp ny kod. Riktigt smidigt att sen kunna ha badges som visar kodtäckning och om det har klarat testerna. Detta medför att man har bättre koll på kodtäckning och om koden går igenom testerna och ser även bra ut när andra besöker mitt repo.
För att få testerna att gå igenom travis så var jag tvungen att specificera node versionerna som skulle användas i testet. Om travis laddade hem den senaste versionen så gick inte testet igenom trots att det fungerar på min pc med senaste node versionen. Valde då att testerna körs med node 14, 12 och 10.  

Jag känner mig riktigt nöjd med betyget av kodkvalitet då koden för mitt backend API fick betyget 10.
