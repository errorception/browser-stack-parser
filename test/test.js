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
			{url: 'http://localhost:3000/stackgen.js', func: 'fn3', args: '', line: 10, column: null },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn2', args: '', line:  6, column: null },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn1', args: '', line:  2, column: null },
			{url: 'http://localhost:3000/stackgen.js', func: '<unknown>', args: '', line: 14, column: null }
    	]);
	});

	it("should parse stacks from Opera", function() {
		var stack = "Error thrown at line 10, column 1 in fn3() in http://localhost:3000/stackgen.js:\n    nonExistantFunction(\"arg1\", \"arg2\");\ncalled from line 6, column 1 in fn2(arg1, arg2) in http://localhost:3000/stackgen.js:\n    fn3(arg1, arg2);\ncalled from line 2, column 1 in fn1(arg1, arg2) in http://localhost:3000/stackgen.js:\n    fn2(arg1, arg2);\ncalled from line 14, column 1 in http://localhost:3000/stackgen.js:\n    fn1();";

		var parsed = parse(stack);
		parsed.should.have.lengthOf(3);
		parsed.should.eql([
			{line: 10, column: 1, func: 'fn3', args: [], url: 'http://localhost:3000/stackgen.js' },
			{line:  6, column: 1, func: 'fn2', args: [ 'arg1', ' arg2' ], url: 'http://localhost:3000/stackgen.js' },
			{line:  2, column: 1, func: 'fn1', args: [ 'arg1', ' arg2' ], url: 'http://localhost:3000/stackgen.js' }
		]);
	});

	it("should parse stacks from Safari", function() {
		var stack = "fn3@http://localhost:3000/stackgen.js:10:21\nfn2@http://localhost:3000/stackgen.js:6:5\nfn1@http://localhost:3000/stackgen.js:2:5\nglobal code@http://localhost:3000/stackgen.js:14:5";

		var parsed = parse(stack);
		parsed.should.have.lengthOf(3);
		parsed.should.eql([
			{url: 'http://localhost:3000/stackgen.js', func: 'fn3', args: '', line: 10, column: 21 },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn2', args: '', line:  6, column: 5 },
			{url: 'http://localhost:3000/stackgen.js', func: 'fn1', args: '', line:  2, column: 5 }
		]);
	});
});
