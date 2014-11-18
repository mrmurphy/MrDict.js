'use strict';

var expect = require('chai').expect;
var mrdict = require('./mrdict');

describe('mrdict', function() {
	it('should set and retrieve data by key', function (done) {
		var d = mrdict.newMrDict();
		d.set('1', 1);
		var result = d.get('1');
		expect(result).to.equal(1);
		done();
	});

	it('should return a default value if no key is found', function (done) {
		var d = mrdict.newMrDict();
		var result = d.get('1', 'default');
		expect(result).to.equal('default');
		done();
	});

	it('should return null if no key is found and no default value is set', function (done) {
		var d = mrdict.newMrDict();
		var result = d.get('1');
		expect(result).to.equal(null);
		done();
	});

	it('should replace an existing value with a new value', function (done) {
		var d = mrdict.newMrDict();
		d.set('1', 1);
		expect(d.get('1')).to.equal(1);
		d.set('1', 'one');
		expect(d.get('1')).to.equal('one');
		done();
	});

	it('should replace an existing value with a new value', function (done) {
		var d = mrdict.newMrDict();
		d.set('1', 1);
		expect(d.get('1')).to.equal(1);
		d.set('1', 'one');
		expect(d.get('1')).to.equal('one');
		done();
	});

	it('should remove an existing key', function (done) {
		var d = mrdict.newMrDict();
		d.set('1', 1);
		expect(d.get('1')).to.equal(1);
		d.remove('1');
		expect(d.get('1')).to.equal(null);
		done();
	});

	it('should remove an existing key that has a key collision', function (done) {
		// 28 and 135
		var d = mrdict.newMrDict();
		d.set('135', 135);
		expect(d.get('135')).to.equal(135);
		d.set('28', 28);
		expect(d.get('28')).to.equal(28);
		d.remove('135');
		expect(d.get('135')).to.equal(null);
		expect(d.get('28')).to.equal(28);
		done();
	});

	it('should function when filled to twice its capacity', function(done) {
		var d = mrdict.newMrDict();
		var expectations = [];

		function makeExpectationFunction(i) {
			return function() {
				expect(d.get('' + i)).to.equal(i);
			}
		}

		for (var i = 6157; i >= 0; i--) {
			d.set('' + i, i);
			expectations.push(makeExpectationFunction(i))
		}

		expectations.forEach(function(func) {
			func();
		})
		done();
	});
});
