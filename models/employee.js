'use strict';

const moment = require('moment');
const statuses = require('../constants/statuses');
const commandTypes = require('../constants/commandTypes');
const mongoose = require('bluebird').promisifyAll(require('mongoose')),
    Schema = mongoose.Schema,
employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  default_status: { type: String, required: true },
  schedule: [String],
  date_created: Date,
  date_updated: Date,
  status: {type: Schema.Types.ObjectId, ref: 'Status'}
});

employeeSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

employeeSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    return this.constructor.findOneAsync({ email: value })
      .then(function(user) {
        if (user) {
          if (self.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

const Employee = mongoose.model('Employees', employeeSchema);
module.exports = Employee;