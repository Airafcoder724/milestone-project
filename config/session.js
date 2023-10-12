const expressSession = require('express-session')
const mongoDbstore = require('connect-mongodb-session');

function createSessionStore(){
    const MongoDbstore = mongoDbstore(expressSession);

    const store = new MongoDbstore({
        uri : process.env.MONGO_URL, // 
        databaseName:'online-shop',
        collection : 'sessions'
    });

    return store;
}

function createSessionConfig(){
    return {
        secret : 'Airaf-is-web-maker',
        resave : false,
        saveUninitialized : false,
        store : createSessionStore(),
        cookie:{
            maxAge : 2 * 24 * 60 * 60 * 1000
        }
    }
}

module.exports = createSessionConfig;