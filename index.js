'use strict';

const Hapi = require('hapi'),
	config = require('./config'),
	validate = require('./basic-auth-validate'),
	server = new Hapi.Server(),
  mongoose = require('mongoose');

server.connection({
  port: config.port,
  routes: {
    cors: true
  }
});

mongoose.connect(config.mongo.uri);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

server.register(require('hapi-auth-basic'), () => {

  server.auth.strategy('simple', 'basic', {validateFunc: validate});

  server.route(require('./routes'));

  server.start(() => {
    console.log('Server running at:', server.info.uri);
  });
});
