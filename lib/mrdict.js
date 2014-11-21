'use strict';
/* @flow */

var hasher = require('./mrhash');

var TABLE_SIZE = 3079;

function _getIndexFromKey(key) {
	var hashed = hasher.hashString(key);
	var hashedModded = hashed % TABLE_SIZE
	return hashedModded
}

// _findStartingWith follows a linked list, locating
// an element with a given key.
// Expects:
//   obj: an object that is the start of a chain or null
//   key: the key string of the object
// Returns:
//   null if obj with key is not found, or if obj is null
//   obj with key if found
function _findInList(obj, key) {
	if (obj === null) {
		return null;
	}

	var prev = null;
	var cursor = obj;

	// Find an obj in the list with key=key
	do {
		if (cursor.key === key) {
			// Add a .prev attribute for convenience in other functions
			cursor.prev = prev;
			return cursor;
		}
		prev = cursor;
		cursor = cursor.next
	} while (cursor != null);

	// No object was found, return null
	return null;
}

// _deleteFromList iterates over a linked list, locating
// an element with a given key. The element gets removed
// if found.
// Expects:
//   obj: an object that is the start of a chain or null
//   key: the key string of the object
// Returns:
//   null if obj is null
//   null if obj.key === key, and is the only item in the list
//   obj in all other cases where obj is the first item in the list
function _deleteFromList(obj, key) {
	if (obj === null) {
		return null;
	}

	var found = _findInList(obj, key);

	if (found === null) {
		return null;
	}

	if (found === obj) {
		// Found is the first in the chain.
		// Return the next object as the
		// new first object.
		return obj.next;
	}

	if (found.next === null) {
		// Found is the last in the chain.
		// Set the prev as the new last
		// and return it.
		found.prev.next = null;
		return found.prev;
	}

	// Found is in the middle of the list.
	// Set prev's next as found's next
	// and return the first item.
	found.prev.next = found.next;
	return obj;
}

// _updateList either starts a new linked list with
// newObj, or adds newObj to the list. If the 
// object's key is already present in the list, the
// associated value is replaced by the new object's value.
// Expects:
//   obj: an object that is the start of a chain or null
//   newObj: an object to be inserted into the list
// Returns:
//   the first item of the list
function _updateList(obj, newObj) {
	if (obj === null || obj === undefined) {
		newObj.next = null;
		return newObj;
	}

	var found = _findInList(obj, newObj.key);

	if (found === null) {
		// The key wasn't present in the list.
		// Push the object onto the beginning.
		newObj.next = obj;
		return newObj;
	}

	// The key was already in the list.
	// Just update the associated value.
	found.value = newObj.value;
	return obj;
}

var MrDict = function() {
	this.table = [];
};

MrDict.prototype.set = function(key, val) {
	var hashedKey = _getIndexFromKey(key);
	var listObj = {
		key: key,
		value: val
	};
	this.table[hashedKey] = _updateList(this.table[hashedKey], listObj)
};

MrDict.prototype.get = function (key, fallback) {
	var hashedKey = _getIndexFromKey(key);
	if (this.table[hashedKey] === undefined) {
		return fallback || null;
	}
	var found = _findInList(this.table[hashedKey], key)
	return found === null ? found : found.value;
};

MrDict.prototype.remove = function (key) {
	var hashedKey = _getIndexFromKey(key);
	this.table[hashedKey] = _deleteFromList(this.table[hashedKey], key)
};

module.exports = {
	setTableSize: function(size) {
		TABLE_SIZE = size;
	},
	newMrDict: function() {
		return new MrDict()
	}
};
