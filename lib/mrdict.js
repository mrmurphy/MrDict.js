'use strict';

var hasher = require('./mrhash');

var TABLE_SIZE = 3079;

function _getIndexFromKey(key) {
	var hashed = hasher.hashString(key);
	var hashedModded = hashed % TABLE_SIZE
	return hashedModded
}

function _removeObj(table, obj, prev, hashedKey) {
	if (prev === null) {
		// This is the first object in the chain
		table[hashedKey] = obj.next;
		return;
	} else {
		prev.next = obj.next;
		return;
	}
}

function _find(table, key, hashedKey, shouldDelete) {
	var prev = null;
	var cursor = table[hashedKey];
	if (cursor === null) {
		return null;
	}
	do {
		if (cursor.key === key) {
			if (shouldDelete) {
				_removeObj(table, cursor, prev, hashedKey);
				return;
			} else {
				return cursor;
			}
		}
		if (cursor.next === null) {
			return null;
		}
		prev = cursor;
		cursor = cursor.next;
	} while (cursor !== null);
	return null;
}

var MrDict = function() {
	this.table = [];
};

MrDict.prototype.set = function(key, val) {
	var hashedKey = _getIndexFromKey(key);
	var listObj = {
		key: key,
		value: val,
		next: null
	};
	if (this.table[hashedKey] === undefined) {
		this.table[hashedKey] = listObj;
	} else {
		var prev = null;
		var cursor = this.table[hashedKey];
		do {
			if (cursor.key === listObj.key && prev !== null) {
				prev.next = listObj;
				return;
			} else if (cursor.key === listObj.key && prev === null) {
				this.table[hashedKey] = listObj;
				return;
			}
			prev = cursor;
			cursor = cursor.next;
		} while (cursor !== null);
		prev.next = listObj;
	}
};

MrDict.prototype.get = function (key, fallback) {
	var hashedKey = _getIndexFromKey(key);
	if (this.table[hashedKey] === undefined) {
		return fallback || null;
	}
	var found = _find(this.table, key, hashedKey);
	if (found === null) {
		return fallback || null;
	} else {
		return found.value;
	}
};

MrDict.prototype.remove = function (key) {
	var hashedKey = _getIndexFromKey(key);
	_find(this.table, key, hashedKey, !!'shouldDelete')
};

module.exports = {
	setTableSize: function(size) {
		TABLE_SIZE = size;
	},
	newMrDict: function() {
		return new MrDict()
	}
};
