var UNKNOWN_FUNCTION = "<unknown>";

var chromeOrIE = /\s+at .*(\S+\:\d+|\(native\))/,
	firefoxOrSafari = /(^|@)\S+\:\d+/;

function extractLocation(urlLike) {
	if (urlLike.indexOf(':') === -1) {
		return [urlLike];
	}

	var locationParts = urlLike.replace(/[\(\)\s]/g, '').split(':');
	var lastNumber = locationParts.pop();
	var possibleNumber = locationParts[locationParts.length - 1];

	if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
		var lineNumber = locationParts.pop();
		return [locationParts.join(':'), lineNumber, lastNumber];
	} else {
		return [locationParts.join(':'), lastNumber, undefined];
	}
}

function parseChromeOrIE(stackString) {
	return stackString.split("\n").filter(function(line) {
		return !!line.match(chromeOrIE);
	}).map(function(line) {
		var tokens = line.replace(/^\s+/, "").split(/\s+/).slice(1);
		var locationParts = extractLocation(tokens.pop());
		var functionName = tokens.join(" ") || UNKNOWN_FUNCTION;

		return {
			url: locationParts[0],
			func: functionName.trim(),
			line: +locationParts[1],
			column: +locationParts[2] ? +locationParts[2] : null
		};
	});
}

function parseFirefoxOrSafari(stackString) {
	return stackString.split("\n").filter(function(line) {
		return !!line.match(firefoxOrSafari);
	}).map(function(line) {
		var tokens = line.split('@');
		var locationParts = extractLocation(tokens.pop());
		var functionName = tokens.shift() || UNKNOWN_FUNCTION;

		return {
			url: locationParts[0],
			func: functionName.trim(),
			line: +locationParts[1],
			column: locationParts[2] ? +locationParts[2] : null
		};
	});
}

function parseOpera(stackString) {
	// Opera <= 11 support dropped. 12+ only.
	return stackString.split('\n').filter(function (line) {
		return !!line.match(chromeOrIE) && !line.match(/^Error created at/);
	}).map(function (line) {
		var tokens = line.split('@');
		var locationParts = extractLocation(tokens.pop());
		var functionCall = (tokens.shift() || '');
		var functionName = functionCall
			.replace(/<anonymous function(: (\w+))?>/, '$2')
			.replace(/\([^\)]*\)/g, '') || UNKNOWN_FUNCTION;

		var argsRaw;
		if (functionCall.match(/\(([^\)]*)\)/)) {
			argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
		}
		var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? "" : argsRaw.split(',');
		return {
			url: locationParts[0],
			func: functionName.trim(),
			line: +locationParts[1],
			column: locationParts[2] ? +locationParts[2] : null
		};
	});
}

module.exports = function(stackString) {
	stackString = stackString.trim();

	if(stackString.match(chromeOrIE) && stackString.match(/Error thrown at/)) {
		return parseOpera(stackString);
	} else if(stackString.match(chromeOrIE)) {
		return parseChromeOrIE(stackString);
	} else if(stackString.match(firefoxOrSafari)) {
		return parseFirefoxOrSafari(stackString);
	} else {
		return [];
	}
}
