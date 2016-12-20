"use strict";

var assert = require('assert');
var mergeText = require('../index');

describe('Snapshot', () => {

    it('toString', () => {
        let text = 'Hello\nWorld\nOK';

        let snapshot = mergeText.snapshot(text);
        assert.equal(snapshot.toString(), text);
    });

    it('apply / simple update', () => {
        let text = 'Hello\nWorld';
        let snapshot = mergeText.snapshot(text);

        let update1 = 'Hello-up\nWorld';
        let update2 = 'Hello\nWorld-up';

        let snapshot2 = snapshot.apply(update1, update2);

        assert.equal(snapshot2.toString(), 'Hello-up\nWorld-up\n');
    });

    it('apply / new lines', () => {
        let text = 'Hello\nWorld';
        let snapshot = mergeText.snapshot(text);

        let update1 = '\n\nHello\nWorld';
        let update2 = '\n\nHello\nWorld';

        let snapshot2 = snapshot.apply(update1, update2);
        assert.equal(snapshot2.toString(), '\n\n\n\nHello\nWorld\n');
    });

    it('original test with text', () => {
        let a = 'The red brown fox jumped over the rolling log.';
        let b = 'The brown spotted fox leaped over the rolling log';

        let snapshot = mergeText.snapshot(a);
        let snapshot2 = snapshot.apply(b);

        var expected = b + '\n';
        assert.equal(snapshot2.toString(), expected);
    });

    it('original merge with html', () => {
        let a = 'The red brown fox jumped over the rolling log';
        let b = 'The brown spotted fox leaped over the rolling log';

        let changes = mergeText.snapshot(a).merge(b);

        let html = mergeText.diff.toHtml(changes);
        var expected = 'The <del>red </del>brown <ins>spotted </ins>fox <del>jumped </del><ins>leaped </ins>over the rolling log\n';

        assert.equal(html, expected);
    });

    it('original merge with markdown', () => {
        let a = 'The red brown fox jumped over the rolling log';
        let b = 'The brown spotted fox leaped over the rolling log';

        let changes = mergeText.snapshot(a).merge(b);

        let md = mergeText.diff.toMarkdown(changes);
        var expected = 'The  ~~red~~ brown  __spotted__ fox  ~~jumped~~  __leaped__ over the rolling log\n';

        assert.equal(md, expected);
    });

});
