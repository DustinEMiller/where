'use strict';

const commands = require('../constants/commands');
const statuses = require('../constants/statuses');

var internals = {};

module.exports = internals.commands = function(command) {

  switch (command) {
  case commands.out:
    return statuses.OutOfOffice;
  case commands.here:
    return statuses.InOffice;
  case commands.remote:
    return statuses.Remote;
  case commands.wfotest:
    return statuses.InOffice;
  case commands.wfhtest:
    return statuses.OutOfOffice;
  default:
    return statuses.InOffice;
  }

};

