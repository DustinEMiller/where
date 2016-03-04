'use strict';
const commands = require('../constants/commands');
const commandTypes = require('../constants/commandTypes');
const commandMapper = require('./commandMapper');

function commandParser(commandString, slashCommand) {
  let arguments = commandString.match(/-\w+/g),
      message = '',
      directives = {
        default:null,
        message:''
      }

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