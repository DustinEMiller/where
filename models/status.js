'use strict'

const mongoose = require('bluebird').promisifyAll(require('mongoose'));,
    Schema = mongoose.Schema,
    statusSchema = new Schema({
      employee: {type: Schema.Types.ObjectId, ref: 'Employee'},
      created_at: Date,
      status: { type: String, required: true },
      message: String
    });

const Status = mongoose.model('Statuses', statusSchema);
module.exports = Status;