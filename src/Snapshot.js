"use strict";

var diff = require('./diff');

module.exports = class Snapshot {
    constructor(text) {
        this.text = text;
    }

    apply(updates) {
        updates = Array.isArray(updates) ? updates : Array.prototype.slice.call(arguments);

        if (!updates.length) {
            return this;
        }

        return diff.toText(this.merge(updates));
    }

    merge(updates) {
        updates = Array.isArray(updates) ? updates : Array.prototype.slice.call(arguments);

        if (!updates.length) {
            return this.text.split('');
        }

        updates = updates
            .map((update, idx) => {
                return {
                    id: idx,
                    diff: diff.diffString(this.text, update),
                    current: 0
                };
            })
            .sort((a, b) => a.diff.length > b.diff.length ? -1 : 1);

        var mainUpdate = updates[0];

        var otherUpdates = updates.filter(function (item) {
            return item !== mainUpdate;
        });
        //
        // console.log('main update', require('util').inspect(mainUpdate, {depth: null}));
        // console.log('other updates', require('util').inspect(otherUpdates, {depth: null}));

        var result = [];

        function rollInInserts(update) {
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

        while (mainUpdate.current <= mainUpdate.diff.length) {
            var mainChange = mainUpdate.diff[mainUpdate.current] || null;

            if (mainChange && rollInInserts(mainUpdate)) {
                continue;
            }

            // console.log('>> mainChange', mainChange);

            for (var i = 0; i < otherUpdates.length; i++) {

                var update = otherUpdates[i];

                var change = update.diff[update.current] || null;

                if (change && rollInInserts(update)) {
                    change = update.diff[update.current] || null
                }

                if (mainChange && change) {
                    if (mainChange.type == 'delete' && change.type == 'origin') {
                        result.push(mainChange);
                    }

                    if (mainChange.type == 'origin' && change.type == 'delete') {
                        result.push(change);
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

        // console.log(require('util').inspect(diffs, {depth: null}));

        return result;
    }

    toString() {
        return this.text;
    }
};
