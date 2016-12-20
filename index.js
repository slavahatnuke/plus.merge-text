"use strict";

let Snapshot = require('./src/Snapshot');
exports.snapshot = (text) => new Snapshot(text);
exports.diff = require('./src/diff');