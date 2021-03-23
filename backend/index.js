'use strict';
global.__basedir = __dirname;
global.config = require('./configs')

const chalk      = require("chalk");                    
const express    = require('express')
const logger     = require('./helpers/logger')
const Middleware = require('./middlewares/server-middlewares')
const { handleError } = require('./helpers/error-handler')
const ErrorHandlingMiddleware = require('./middlewares/error-handling')
const models     = require("./models/index"); 


let server = express()

// Server settings
server.set('env', config.env);
server.set('port', config.port);
server.set('hostname', config.hostname); 
server.set('viewDir', config.viewDir);

server.use('/static',express.static(__basedir+'/uploads'))
    
Middleware(server)  

// Setup Database
models.sequelize.sync()
 
// Set up routes
let routes = require('./routes');
routes.init(server); 

//Set up global winston logger
global.Logger = logger

//Error handling  
server.use((err, req, res, next) => {
    console.log(err)
    ErrorHandlingMiddleware(err, res);
});
server.use((err, req, res, next) => {
    handleError(err, res);
});

// let hostname = server.get('hostname'),
//     port = server.get('port');

server.listen(5000, function () {
    console.log('blossom eNPS server listening on');
});