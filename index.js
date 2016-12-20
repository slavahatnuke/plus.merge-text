"use strict";

let Snapshot = require('./src/Snapshot');
exports.snapshot = (text) => new Snapshot(text);