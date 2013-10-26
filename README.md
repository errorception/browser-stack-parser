browser-stack-parser
===

A Node.js module to parse stack traces from browsers, and try to extract as much information from them as possible.

Uses code from the awesome [TraceKit](https://github.com/occ/TraceKit) project.

Parses stack traces from Chrome, Firefox, Opera, and IE>10. 

Example
---

```javascript
var parse = require("browser-stack-parser");

var stack = "ReferenceError: nonExistantFunction is not defined\n    at fn3 (http://localhost:3000/stackgen.js:10:2)\n    at fn2 (http://localhost:3000/stackgen.js:6:2)\n    at fn1 (http://localhost:3000/stackgen.js:2:2)\n    at http://localhost:3000/stackgen.js:14:2"

console.log(parse(stack));

/*
	Should output the following:

	[
		{url: "http://localhost:3000/stackgen.js", func: "fn3", line: 10, column: 2},
		{url: "http://localhost:3000/stackgen.js", func: "fn2", line:  6, column: 2},
		{url: "http://localhost:3000/stackgen.js", func: "fn1", line:  2, column: 2},
		{url: "http://localhost:3000/stackgen.js", func: "<unknown>", line:  14, column: 2}
	]

*/
```

Installation
---

```
npm install browser-stack-parser
```

To run tests, `cd` to the `browser-stack-parser` directory, and run `npm test`.


Known Issues
---

Sometimes skips the bottom-most stack frame in Safari and Opera. Patches welcome.

License
---

MIT