"use strict";

var assert = require('assert');
var mergeText = require('../mergeText');

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

        let html = mergeText.toHtml(changes);
        var expected = 'The <del>red </del>brown <ins>spotted </ins>fox <del>jumped </del><ins>leaped </ins>over the rolling log\n';

        assert.equal(html, expected);
    });

    it('original merge with markdown', () => {
        let a = 'The red brown fox jumped over the rolling log';
        let b = 'The brown spotted fox leaped over the rolling log';

        let changes = mergeText.snapshot(a).merge(b);

        let md = mergeText.toMarkdown(changes);
        var expected = 'The  ~~red~~ brown  __spotted__ fox  ~~jumped~~  __leaped__ over the rolling log\n';

        assert.equal(md, expected);
    });

    it('merge(a,b,c)', () => {
        let origin = 'a';
        let update1 = 'a\nb';
        let update2 = 'a\nc';

        let snapshot = mergeText.merge(origin, update1, update2);
        var expected = 'a\nb\nc\n';

        assert.equal(snapshot.toString(), expected);
    });

    it('snapshot.toHtml()', () => {
        let origin = 'Hello World';
        let update1 = 'Hello this World';
        let update2 = 'Hello new World';

        let snapshot = mergeText.merge(origin, update1, update2);
        var expected = '';

        assert.equal(snapshot.toString(), 'Hello this new World\n');
        assert.equal(snapshot.toHtml(), 'Hello <ins>this </ins><ins>new </ins>World\n');
    });


    it('snapshot.toMarkdown()', () => {
        let origin = 'Hello World';
        let update1 = 'Hello World OK';
        let update2 = 'Hello world';

        let snapshot = mergeText.merge(origin, update1, update2);

        assert.equal(snapshot.toString(), 'Hello OK\nworld\n');
        assert.equal(snapshot.toMarkdown(), 'Hello  ~~World~~  __OK__  __world__ ');
    });
    //
    // it('case1', () => {
    //     let snapshot = mergeText.snapshot('Hello World').apply('World OK', ' Hello C');
    //     assert.equal(snapshot.toString(), '');
    // });


});
