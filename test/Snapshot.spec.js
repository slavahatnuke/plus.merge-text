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

    it('apply / new lines', () => {
        let text = 'Hello\nWorld';
        let snapshot = mergeText.snapshot(text);

        let update1 = '\n\nHello\nWorld';
        let update2 = '\n\nHello\nWorld';

        let snapshot2 = snapshot.apply(update1, update2);
        assert.equal('\n\n\n\nHello\nWorld\n', snapshot2.toString());
    });

    it('original test with text', () => {
        let a = 'The red brown fox jumped over the rolling log.';
        let b = 'The brown spotted fox leaped over the rolling log';

        let snapshot = mergeText.snapshot(a);
        let snapshot2 = snapshot.apply(b);

        assert.equal(b + '\n', snapshot2.toString());
    });

    it('original test with html', () => {
        let a = 'The red brown fox jumped over the rolling log';
        let b = 'The brown spotted fox leaped over the rolling log';

        let changes = mergeText.snapshot(a).merge(b);

        let html = mergeText.diff.toHtml(changes);
        assert.equal('The <del>red </del>brown <ins>spotted </ins>fox <del>jumped </del><ins>leaped </ins>over the rolling log\n', html);
    });

    it('original test with markdown', () => {
        let a = 'The red brown fox jumped over the rolling log';
        let b = 'The brown spotted fox leaped over the rolling log';

        let changes = mergeText.snapshot(a).merge(b);

        let md = mergeText.diff.toMarkdown(changes);
        assert.equal('The  ~~red ~~ brown  __spotted __ fox  ~~jumped ~~  __leaped __ over the rolling log\n', md);
    });

});
