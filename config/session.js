const expressSession = require('express-session')
const mongoDbstore = require('connect-mongodb-session');

function createSessionStore(){
    const MongoDbstore = mongoDbstore(expressSession);

    const store = new MongoDbstore({
        uri : 'mongodb://127.0.0.1:27017',
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