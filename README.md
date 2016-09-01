# Hotspot
 > Map-based service that aggregates ratings of local businesses
![Map View](./asset/Hotspot.png)

## Installation and setup requirements
* Install required dependencies
  * `npm install`
  * To run database (PostgreSQL) locally
    * From terminal: `brew install postgresql`
      * To run:
        * start the db server `postgres -D /usr/local/var/postgres`
        * create a db `createdb dbname`
        * drop a db `dropdb myDatabase`
        * start psql `psql (Optionally: dbname)``
* Facebook API keys
  * Navigate to [Facebook Developer Signup](https://developers.facebook.com/products/login)
  * Get own set of API keys including:
    * Facebook App ID `FACEBOOK_APP_ID`
    * Facebook App Secret `FACEBOOK_APP_SECRET`
    * Save keys globally in ` .bash_profile or .zshrc`
* Yelp API keys
  * Navigate to [Yelp Developers](https://www.yelp.com/developers/)
  * Get own set of API keys including:
    * Yelp consumer key `YELP_CONSUMER_KEY`
    * Yelp consumer secret `YELP_CONSUMER_SECRET`
    * Yelp token `YELP_TOKEN`
    * Yelp token secret `YELP_TOKEN_SECRET`
  * Save keys globally in ` .bash_profile or .zshrc`
* Heroku for deployment
  * Navigate to [Heroku](https://heroku.com) and create a new account
  * Utilize configure environment key value pairs functionality to include Yelp and Facebook keys from above

## Running dev server with hot reloading
`npm run resetdb` in console to set up new DB with schema provided
`npm run server` in console

## Frontend
* Frontend framework is built using React.js, Redux, and Webpack.
* Mapping functionality provided by Mapbox.js and Leaflet.js.

### File structure
* Client - main development files for front end as well as mapping functionality
* Docs - detailed documentation files
* server - development files for server side including;
  * routing
  * authentication
  * database access
  * Yelp calls
* compiled - production folder for front end. Ignored by git and needs to be recompiled by Webpack each iteration.
* server-dist - production folder for server. Heroku will build this on their side.

### Code style
Code is written utilizing Hack Reactor styling guide.

## Server side
* Server is built upon Express and Node.js. Authentication is handled through Passport. Passport-Facebook is included for authentication using a JSON web token.

## Database structure
* Database is setup and run through PostgreSQL.

## Detailed Documentation Available
Please refer to Docs folder for detail on the following:
* Project overview and business case
* Mapping overview and design choices
* Mapping - detail including code snippets and sample JSON responses
* Server api endpoints including functionality descriptions
* Data flow narrative
