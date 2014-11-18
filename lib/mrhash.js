'use strict';

function hashString(str) {
	// This is an FNV hash, adapted from: http://bit.ly/1pTlwXH
	var hash = 2166136261
	for (var i = str.length - 1; i >= 0; i--) {
		hash = (hash * 16777619) ^ str[i]
	}
	return hash
}

module.exports = {
	hashString: hashString
}
