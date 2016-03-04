'use strict';
const commands = require('../constants/commands');
const commandTypes = require('../constants/commandTypes');
const commandMapper = require('./commandMapper');

function commandParser(commandString, slashCommand) {
  var arguments = [],
      message = '',
      directives = {
        default:null,
        message:''
      }
  arguments = commandString.match(/-\w+/g);
  arguments.map(function(argument) {
    if(argument === '-default') {
      directives.default = commandMapper(slashCommand);
      message = message.replace(argument, "");
    }
  });

  directives.message = message;
  return directives;
}

module.exports = function(command, slashCommand) {
  return commandParser(command, slashCommand);
};