var should = require("should"),
	parse = require("../");

describe("stack-parser", function() {
	it("should parse stacks from Chrome", function() {
		var stack = "ReferenceError: nonExistantFunction is not defined\n    at fn3 (http://localhost:3000/stackgen.js:10:2)\n    at fn2 (http://localhost:3000/stackgen.js:6:2)\n    at fn1 (http://localhost:3000/stackgen.js:2:2)\n    at http://localhost:3000/stackgen.js:14:2"

		var parsed = parse(stack);

		parsed.should.have.lengthOf(4);
		parsed.should.eql([
			{url: "http://localhost:3000/stackgen.js", func: "fn3", line: 10, column: 2},
			{url: "http://localhost:3000/stackgen.js", func: "fn2", line:  6, column: 2},
			{url: "http://localhost:3000/stackgen.js", func: "fn1", line:  2, column: 2},
			{url: "http://localhost:3000/stackgen.js", func: "<unknown>", line:  14, column: 2}
		]);
	});

	it("should parse stacks from Firefox", function() {
		var stack = "fn3@http://localhost:3000/stackgen.js:10\nfn2@http://localhost:3000/stackgen.js:6\nfn1@http://localhost:3000/stackgen.js:2\n@http://localhost:3000/stackgen.js:14\n";

		var parsed = parse(stack);
		parsed.should.have.lengthOf(4);
		parsed.should.eql([
			{url: 'http://localhost:3000/stackgen.js', func: 'fn3', line: 10, column: null },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn2', line:  6, column: null },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn1', line:  2, column: null },
			{url: 'http://localhost:3000/stackgen.js', func: '<unknown>', line: 14, column: null }
    	]);
	});

	it("should parse stacks from Firefox 30+ (with column numbers)", function() {
		// Stack example taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack#Example
		var stack = "trace@file:///C:/example.html:9:17\nb@file:///C:/example.html:16:13\na@file:///C:/example.html:19:13\n@file:///C:/example.html:21:9"

		var parsed = parse(stack);
		parsed.should.have.lengthOf(4);
		parsed.should.eql([
			{ url: 'file:///C:/example.html', func: 'trace', line: 9, column: 17 },
			{ url: 'file:///C:/example.html', func: 'b', line: 16, column: 13 },
			{ url: 'file:///C:/example.html', func: 'a', line: 19, column: 13 },
			{ url: 'file:///C:/example.html', func: '<unknown>', line: 21, column: 9 }
		]);
	});

	it("should parse stacks from Safari", function() {
		var stack = "fn3@http://localhost:3000/stackgen.js:10:21\nfn2@http://localhost:3000/stackgen.js:6:5\nfn1@http://localhost:3000/stackgen.js:2:5\nglobal code@http://localhost:3000/stackgen.js:14:5";

		var parsed = parse(stack);
		parsed.should.have.lengthOf(4);
		parsed.should.eql([
			{url: 'http://localhost:3000/stackgen.js', func: 'fn3', line: 10, column: 21 },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn2', line:  6, column: 5 },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn1', line:  2, column: 5 },
			{url: 'http://localhost:3000/stackgen.js', func: 'global code', line:  14, column: 5 }
		]);
	});

	it("should parse stacks with function name containing spaces in gecko-style stacks", function() {
		var stack = "my function@http://localhost:3000/stackgen.js:10:21";

		var parsed = parse(stack);
		parsed.should.have.lengthOf(1);
		parsed.should.eql([
			{url: 'http://localhost:3000/stackgen.js', func: 'my function', line:  10, column: 21 }
		]);
	});

	it("should parse stacks with function name containing spaces in chrome-style stacks", function() {
		var stack = "ReferenceError: nonExistantFunction is not defined\n    at my function (http://localhost:3000/stackgen.js:10:21)";

		var parsed = parse(stack);
		parsed.should.have.lengthOf(1);
		parsed.should.eql([
			{url: 'http://localhost:3000/stackgen.js', func: 'my function', line:  10, column: 21 }
		]);
	});

	it("should parse stacks with the new keyword", function() {
		// https://github.com/occ/TraceKit/issues/66
		var stack = "Error: BEEP2\n    new <anonymous>@https://webclient.mini.net/tmp/scripts/index.js:643:11\n    d@https://webclient.mini.net/tmp/scripts/libraries.js:34:265\n    Object.instantiate@https://webclient.mini.net/tmp/scripts/libraries.js:34:394\n    $get@https://webclient.mini.net/tmp/scripts/libraries.js:66:112\n    {anonymous}()@https://webclient.mini.net/tmp/scripts/libraries.js:53:14";

		var parsed = parse(stack);
		parsed.should.eql([
			{url: 'https://webclient.mini.net/tmp/scripts/index.js', func: 'new <anonymous>', line: 643, column: 11},
			{url: 'https://webclient.mini.net/tmp/scripts/libraries.js', func: 'd', line: 34, column: 265},
			{url: 'https://webclient.mini.net/tmp/scripts/libraries.js', func: 'Object.instantiate', line: 34, column: 394},
			{url: 'https://webclient.mini.net/tmp/scripts/libraries.js', func: '$get', line: 66, column: 112},
			{url: 'https://webclient.mini.net/tmp/scripts/libraries.js', func: '{anonymous}()', line: 53, column: 14}
		]);
	});
});
