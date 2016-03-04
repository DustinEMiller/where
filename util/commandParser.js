'use strict';
const commands = require('../constants/commands');
const commandTypes = require('../constants/commandTypes');
const commandMapper = require('./commandMapper');

function commandParser(commandString, slashCommand) {
  var args = commandString.match(/-\w+/g),
      message = commandString,
      directives = {
        default:null,
        message:''
      }
      
  if(args) {
    args.map(function(argument) {
      if(argument === '-default') {
        directives.default = commandMapper(slashCommand);
        message = message.replace(argument, "");
      }
    });
  }

  directives.message = message;
  return directives;
}

module.exports = function(command, slashCommand) {
  return commandParser(command, slashCommand);
};