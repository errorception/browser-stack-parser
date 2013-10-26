function fn1(arg1, arg2) {
	fn2(arg1, arg2);
}

function fn2(arg1, arg2) {
	fn3(arg1, arg2);
}

function fn3() {
	nonExistantFunction("arg1", "arg2");
}

try {
	fn1("a", "b");
} catch(e) {
	document.getElementById("stack").appendChild(document.createTextNode(e.stacktrace || e.stack));
	if(window.JSON) {
		document.getElementById("stackText").appendChild(document.createTextNode(JSON.stringify(e.stacktrace || e.stack)));
	}
}
