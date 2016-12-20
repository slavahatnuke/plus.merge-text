var plusMergeText =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/*
	 * Javascript Diff Algorithm
	 *  By John Resig (http://ejohn.org/)
	 *  Modified by Chu Alan "sprite"
	 *
	 * Released under the MIT license.
	 *
	 * More Info:
	 *  http://ejohn.org/projects/javascript-diff-algorithm/
	 */

	"use strict";

	function escape(s) {
	    return s;
	}

	function diff(o, n) {
	    o = o.replace(/\s+$/, '');
	    n = n.replace(/\s+$/, '');

	    var out = diffArrays(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));
	    var resultString = [];

	    var oSpace = o.match(/\s+/g);
	    if (oSpace == null) {
	        oSpace = ["\n"];
	    } else {
	        oSpace.push("\n");
	    }
	    var nSpace = n.match(/\s+/g);
	    if (nSpace == null) {
	        nSpace = ["\n"];
	    } else {
	        nSpace.push("\n");
	    }

	    if (out.n.length == 0) {
	        for (var i = 0; i < out.o.length; i++) {
	            resultString.push({type: 'delete', value: escape(out.o[i]) + oSpace[i]});
	        }
	    } else {
	        if (out.n[0].text == null) {
	            for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
	                resultString.push({type: 'delete', value: escape(out.o[n]) + oSpace[n]});
	            }
	        }

	        for (var i = 0; i < out.n.length; i++) {
	            if (out.n[i].text == null) {
	                resultString.push({type: 'insert', value: escape(out.n[i]) + nSpace[i]});
	            } else {
	                resultString.push({type: 'origin', value: out.n[i].text + nSpace[i]});

	                for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
	                    resultString.push({type: 'delete', value: escape(out.o[n]) + oSpace[n]});
	                }
	            }
	        }
	    }

	    return resultString;
	}

	function diffArrays(o, n) {
	    var ns = {};
	    var os = {};

	    for (var i = 0; i < n.length; i++) {
	        if (ns[n[i]] == null)
	            ns[n[i]] = {rows: [], o: null};
	        ns[n[i]].rows.push(i);
	    }

	    for (var i = 0; i < o.length; i++) {
	        if (os[o[i]] == null)
	            os[o[i]] = {rows: [], n: null};
	        os[o[i]].rows.push(i);
	    }

	    for (var i in ns) {
	        if (ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1) {
	            n[ns[i].rows[0]] = {text: n[ns[i].rows[0]], row: os[i].rows[0]};
	            o[os[i].rows[0]] = {text: o[os[i].rows[0]], row: ns[i].rows[0]};
	        }
	    }

	    for (var i = 0; i < n.length - 1; i++) {
	        if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
	            n[i + 1] == o[n[i].row + 1]) {
	            n[i + 1] = {text: n[i + 1], row: n[i].row + 1};
	            o[n[i].row + 1] = {text: o[n[i].row + 1], row: i + 1};
	        }
	    }

	    for (var i = n.length - 1; i > 0; i--) {
	        if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
	            n[i - 1] == o[n[i].row - 1]) {
	            n[i - 1] = {text: n[i - 1], row: n[i].row - 1};
	            o[n[i].row - 1] = {text: o[n[i].row - 1], row: i - 1};
	        }
	    }

	    return {o: o, n: n};
	}

	function toText(changes) {
	    return changes
	        .filter(function (item) {
	            return item.type !== 'delete';
	        })
	        .map(function (item) {
	            return item.value;
	        })
	        .join('');
	}


	function toHtml(changes) {
	    var mapper = {
	        'delete': function (value) {
	            return '<del>' + ('' + value).trim() + ' </del>';
	        },
	        'insert': function (value) {
	            return '<ins>' + ('' + value).trim() + ' </ins>';
	        }
	    };

	    return changes
	        .map(function (item) {
	            return mapper[item.type] ? mapper[item.type](item.value) : item.value;
	        })
	        .join('');
	}

	function toMarkdown(changes) {
	    var mapper = {
	        'delete': function (value) {
	            return ' ~~' + ('' + value).trim() + '~~ ';
	        },
	        'insert': function (value) {
	            return ' __' + ('' + value).trim() + '__ ';
	        }
	    };

	    return changes
	        .map(function (item) {
	            return mapper[item.type] ? mapper[item.type](item.value) : item.value;
	        })
	        .join('');
	}

	function Snapshot(text, changes) {
	    this.text = text;
	    this.changes = changes || [];
	}


	function Snapshot_rollInInserts(update, result) {
	    var change = update.diff[update.current] || null;
	    var hasChanges = false;

	    while (change && change.type == 'insert') {
	        result.push(change);
	        update.current++;
	        change = update.diff[update.current] || null;
	        hasChanges = true;
	    }

	    return hasChanges;
	}

	Snapshot.prototype = {
	    apply: function (updates) {
	        updates = Array.isArray(updates) ? updates : Array.prototype.slice.call(arguments);

	        if (!updates.length) {
	            return this;
	        }

	        var changes = this.merge(updates);
	        return new Snapshot(toText(changes), changes);
	    },

	    merge: function (updates) {
	        var self = this;

	        updates = Array.isArray(updates) ? updates : Array.prototype.slice.call(arguments);

	        if (!updates.length) {
	            return diff(self.text, self.text);
	        }

	        updates = updates
	            .map(function (update, idx) {
	                return {
	                    id: idx,
	                    diff: diff(self.text, update),
	                    current: 0
	                };
	            })
	            .sort(function (a, b) {
	                return a.diff.length >= b.diff.length ? -1 : 1;
	            });

	        var mainUpdate = updates[0];

	        var otherUpdates = updates.filter(function (item) {
	            return item !== mainUpdate;
	        });

	        // console.log('main update', require('util').inspect(mainUpdate, {depth: null}));
	        // console.log('other updates', require('util').inspect(otherUpdates, {depth: null}));

	        var result = [];

	        while (mainUpdate.current <= mainUpdate.diff.length) {
	            var mainChange = mainUpdate.diff[mainUpdate.current] || null;

	            if (mainChange && Snapshot_rollInInserts(mainUpdate, result)) {
	                continue;
	            }

	            if (!otherUpdates.length) {
	                if (mainChange) {
	                    result.push(mainChange);
	                }

	                mainUpdate.current++;
	                continue;
	            }

	            for (var i = 0; i < otherUpdates.length; i++) {

	                var update = otherUpdates[i];

	                var change = update.diff[update.current] || null;

	                if (change && Snapshot_rollInInserts(update, result)) {
	                    change = update.diff[update.current] || null
	                }

	                if (mainChange && change) {
	                    if (mainChange.type == 'delete' && change.type == 'origin') {
	                        result.push(mainChange);
	                    }

	                    if (mainChange.type == 'origin' && change.type == 'delete') {
	                        result.push(change);
	                    }

	                    if (mainChange.type == 'origin' && change.type == 'origin') {
	                        result.push(mainChange);

	                        if (mainChange.value !== change.value) {
	                            result.push(change);
	                        }
	                    }

	                    mainUpdate.current++;
	                    update.current++;
	                } else if (change) {
	                    result.push(change);
	                    mainUpdate.current++;
	                    update.current++;
	                } else if (mainChange) {
	                    result.push(mainChange);
	                    mainUpdate.current++;
	                } else {
	                    mainUpdate.current++;
	                }
	            }
	        }

	        // console.log('result', result);
	        // console.log('\n');
	        // console.log('\n');

	        return result;
	    },

	    toString: function () {
	        return this.text;
	    },

	    toHtml: function () {
	        if (this.changes.length) {
	            return toHtml(this.changes);
	        } else {
	            return this.text;
	        }
	    },

	    toMarkdown: function () {
	        if (this.changes.length) {
	            return toMarkdown(this.changes);
	        } else {
	            return this.text;
	        }
	    }
	};

	function merge(origin, change1, changeN) {
	    var updates = Array.isArray(origin) ? origin : Array.prototype.slice.call(arguments);
	    origin = updates.shift();
	    return (new Snapshot(origin)).apply(updates);
	}

	module.exports.diff = diff;
	module.exports.merge = merge;

	module.exports.toText = toText;
	module.exports.toHtml = toHtml;
	module.exports.toMarkdown = toMarkdown;

	module.exports.Snapshot = Snapshot;
	module.exports.snapshot = function (text) {
	    return new Snapshot(text);
	};


/***/ }
/******/ ]);