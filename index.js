var UNKNOWN_FUNCTION = "<unknown>";

function fromStackTraceProperty(stackString) { // new Opera
	var testRE = / line (\d+), column (\d+) in (?:<anonymous function: ([^>]+)>|([^\)]+))\((.*)\) in (.*):\s*$/i,
		lines = stackString.split('\n'),
		stack = [],
		parts;

	lines = lines.map(function(str) { return str.trim(); }).filter(function(str) { return !!str; });

	for (var i = 0, j = lines.length; i < j; i += 2) {
		if((parts = testRE.exec(lines[i]))) {
			stack.push({
				line: +parts[1],
				column: +parts[2],
				func: parts[3] || parts[4],
				args: parts[5] ? parts[5].split(',') : [],
				url: parts[6]
			});
		}
	}

	return stack.length?stack:null;
}

function fromStackProperty(stackString) {
	var chrome = /^\s*at (?:((?:\[object object\])?[\S ]*\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
		gecko = /^\s*(\S*[ \S]*)(?:\((.*?)\))?@((?:file|http|https).*?):(\d+)(?::(\d+))?\s*$/i,
		lines = stackString.split('\n'),
		stack = [],
		parts;

	for (var i = 0, j = lines.length; i < j; ++i) {
		if ((parts = gecko.exec(lines[i]))) {
			stack.push({
				url: parts[3],
				func: parts[1] || UNKNOWN_FUNCTION,
				args: parts[2] ? parts[2].split(',') : '',
				line: +parts[4],
				column: parts[5] ? +parts[5] : null
			});
		} else if ((parts = chrome.exec(lines[i]))) {
			stack.push({
				url: parts[2],
				func: parts[1] || UNKNOWN_FUNCTION,
				line: +parts[3],
				column: parts[4] ? +parts[4] : null
			});
		}
	}

	return stack.length?stack:null;
}

module.exports = function(stackString) {
	stackString = stackString.trim();
	var stack;

	try {
		stack = fromStackTraceProperty(stackString);
		if(stack) return stack;
	} catch(e) {
		console.err(e);
	}

	try {
		stack = fromStackProperty(stackString);
		if(stack) return stack;
	} catch(e) {
		console.err(e);
	}

	return [];
};
