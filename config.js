'use strict';
var getEnv = require('getenv');
var path = require('path');

module.exports = {
  port: getEnv.int('PORT', 3000),
  mongo:{
    uri: 'mongodb://'.getEnv('WHERE_USERNAME', '').':'.getEnv('WHERE_PASSWORD', '').'@'.getEnv('MONGO_HOST', 'localhost').':'.getEnv.int('MONGO_PORT', 27017).'/'.getEnv('WHERE_MONGO_NAME', 'where')
  },
  segment:{
    writeKey: getEnv('SEGMENT_IO_WRITE_KEY', ''),
  },
  slack:{
    token: getEnv('SLACK_TOKEN', ''),
    webhooks:{
      requestTokens: getEnv('WHERE_SLACK_WEBHOOK_TOKENS', '').split(',')
    }
  },
  auth:{
    admin:{
      password: getEnv('ADMIN_PASSWORD', '$2a$10$oIeQ626Z5yIU7IsvC.1t2.JaegXE1Jn9FaLxF1SfA/jXgQNFah/Wu')
    }
  }
};
