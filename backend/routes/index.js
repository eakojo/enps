'use strict'
const UserController = require('../controllers/user-controller')
const AccountController = require('../controllers/account-controller')
const BusinessController = require('../controllers/business-controller')
function init(server) {
	/**	
		* * * * * * * * * Default Endpoints * * * * * * * *
	**/	
	server.get('*', function (req, res, next) {
		console.log('Request was made to: ' + req.originalUrl);
		return next();
	});

	server.get('/', function (req, res) { 
		res.send('Blossom Academy Learning Management System');
	});

	server.get('/api', function(req, res){
		res.send('Api endpointis working ...')
	})

	server.use('/api/users', UserController)
	server.use('/api/accounts', AccountController)
	server.use('/api/business', BusinessController)
	// server.use('/api/files', FileController)
}

module.exports = {
	init: init
};