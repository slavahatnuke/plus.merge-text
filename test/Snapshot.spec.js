"use strict";

var assert = require('assert');
var mergeText = require('../index');
describe('Snapshot', () => {

    it('toString', () => {
        let text = 'Hello\nWorld\nOK';

        let snapshot = mergeText.snapshot(text);
        assert.equal(text, snapshot.toString());
    });

    it('apply / simple update', () => {
        let text = 'Hello\nWorld';
        let snapshot = mergeText.snapshot(text);

        let update1 = 'Hello-up\nWorld';
        let update2 = 'Hello\nWorld-up';

        let snapshot2 = snapshot.apply(update1, update2);

        assert.equal('Hello-up\nWorld-up\n', snapshot2.toString());
    });
    //
    // it('apply / new lines', () => {
    //     let text = 'Hello\nWorld';
    //     let snapshot = mergeText.snapshot(text);
    //
    //     let update1 = '\n\nHello\nWorld';
    //     let update2 = '\n\nHello\nWorld';
    //
    //     let snapshot2 = snapshot.apply(update1, update2);
    //
    //     console.log(snapshot2.toString());
    //     assert.equal('\n\nHello\nWorld', snapshot2.toString());
    // });

});
