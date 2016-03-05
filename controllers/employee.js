'use strict';
const Boom = require('boom');
const req = require('request');

const config = require('../config');
const Employee = require('../models/employee');
const logEvent = require('../util/logEvent');
const Slack = require('../util/slack');
const commandMapper = require('../util/commandMapper');
const commandParser = require('../util/commandParser');
const commands = require('../constants/commands');

const slack = new Slack({
  token: config.slack.token
});

module.exports.getAll = function(request, reply) {

  Employee.getAll()
    .then((workers) => {
      reply(workers);
    })
    .catch((err) => {
      console.log(err);
      reply(Boom.badImplementation());
    });

};

module.exports.addNew = function(request, reply) {

  var payload = request.payload;

  Employee.getByEmail(payload.email)
    .then((employee) => {
      if (employee) {
        return reply(Boom.conflict());
      }

      if (!Employee.isValidStatus(payload.status)) {
        return reply(Boom.badRequest(`Not a valid status type Email: ${payload.email}`));
      }

      var employee = new Employee(payload)
        .save(payload)
        .then((worker) => {

          reply();

          if (worker) {
            logEvent(employee);
          }
        });

    })
    .catch((err) => {
      console.log(err);
      reply(Boom.badImplementation());
    });

};

module.exports.updateStatus = function(request, reply) {
  var payload = request.payload;

  if (!Employee.isValidStatus(payload.status)) {
    return reply(Boom.badRequest('Not a valid status type'));
  }

  Employee.updateStatus(payload.email, payload.status)
    .then((employee) => {
      if (!employee) {
        return reply(Boom.notFound('Email Address Not Found'));
      }

      reply(employee);

      logEvent(employee);

    })
    .catch((err) => {
      console.log(err);
      reply(Boom.badImplementation());
    });
};

module.exports.delete = function(request, reply) {
  Employee.delete(request.params.id)
  .then((employee) => {
    if (!employee) {
      return reply(Boom.notFound('Worker not found'));
    }

    reply();
  })
  .catch((err) => {
    console.log(err);
    reply(Boom.badImplementation());
  });
};

function slackTokenMatch(token) {
  const tokens = config.slack.webhooks.requestTokens;
  const match = tokens.filter((t) => t === token);

  return match.length > 0;
}

module.exports.slackHook = function(request, reply) {
  const payload = request.payload;

  if (!slackTokenMatch(payload.token)) {
    return reply(Boom.badRequest('Bad Request Token'));
  }

  const slashCommand = payload.command.substr('1');
  const status = commandMapper(slashCommand);
  const command = commandParser(payload.text, slashCommand);

  slack.getUserInfo(payload.user_id)
    .then((result) => {
      const profile = result.user.profile;

      return Employee.getByEmail(profile.email)
        .then((employee) => {

          if (!employee) {

            return new Employee({
              name: profile.realName,
              email: profile.email,
              status,
              command
            })
            .save();

          } else {

            return Employee.updateStatus(employee.email, status, command);
          }
        })
        .then((employee) => {
          var message = '',
              botResponse;
          if(employee.message){
            message = ' "'+employee.message+'"';
          }
          botResponse = '*' + employee.name + '*: ' + employee.status + message;
          req({
            url: 'https://hooks.slack.com/services/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',
            method: 'POST',
            json: {
              channel: "#where",
              username: "Where Bot",
              text: botResponse
            }
          }, function(err, res) {
            console.log(err, res);
          });
          reply(`Updated status to *${employee.status}*, your default status is: *${employee.defaultStatus}*, to change your default status use \`/${slashCommand} default:wfo\` for *InOffice* and \`/${slashCommand} default:wfh\` for *OutOfOffice*. You can also set a message with your status: \`/${slashCommand} This is my message!\``);
          logEvent(employee);
        });
    })
    .catch((err) => {
      console.log(err);
      reply(Boom.badImplementation());
    });
};

module.exports.getWhere = function(request, reply) {
  const payload = request.payload; 

  if (!slackTokenMatch(payload.token)) {
    return reply(Boom.badRequest('Bad Request Token'));
  }

  if (payload.text === '') {
    Employee.getAll()
      .then((workers) => {
        var status = '';
        workers.sort( function( a, b ) {
          a = a.email.substring(a.email.indexOf(".")+1,a.email.lastIndexOf("@"));
          b = b.email.substring(b.email.indexOf(".")+1,b.email.lastIndexOf("@"));

          return a < b ? -1 : a > b ? 1 : 0;
        });

        workers.map(function(worker){
          var message = '';
          if(worker.message){
            message = ' "'+worker.message+'"';
          }
          status += '*'+worker.name + '*: ' + worker.status.statusType + message + '\n';
        });
        reply(status);
      })
      .catch((err) => {
        console.log(err);
        reply(Boom.badImplementation());
      });  
  } else {
    var searchText = payload.text.toLowerCase();
    Employee.getByPartialName(searchText)
      .then((workers) => {
        var status = '';
        workers.sort( function( a, b ) {
          a = a.email.substring(a.email.indexOf(".")+1,a.email.lastIndexOf("@"));
          b = b.email.substring(b.email.indexOf(".")+1,b.email.lastIndexOf("@"));

          return a < b ? -1 : a > b ? 1 : 0;
        });

        workers.map(function(worker){
          var message = '';
          if(worker.message){
            message = ' "'+worker.message+'"';
          }
          status += '*'+worker.name + '*: ' + worker.status.statusType + message + '\n';
        });
        
        if (status === '') {
          status = 'No employees found.'
        }
        reply(status);
      })
      .catch((err) => {
        console.log(err);
        reply(Boom.badImplementation());
      }); 
  }
};

