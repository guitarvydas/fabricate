dev:
	rm -f fab.js
	(make fab.js)
	(make diff0)

all: diff

diff:
	 ~/node_modules/js-beautify/js/bin/js-beautify.js fab-js.js >fab-js.b
	 ~/node_modules/js-beautify/js/bin/js-beautify.js gen.js >gen.b
	diff -wBb fab-js.b gen.b

diff0:
	 ~/node_modules/js-beautify/js/bin/js-beautify.js gen.js >gen.b
	 ~/node_modules/js-beautify/js/bin/js-beautify.js gen2.js >gen2.b
	diff -wBb gen.b gen2.b

fab.js: gen.js fab.ohm
	echo >temp.js
	echo 'const fmtGrammar = String.raw`' >>temp.js
	cat fab.ohm >>temp.js
	echo '`;' >>temp.js
	echo 'const semObject =' >>temp.js
	cat fab-js.js >>temp.js
	echo ';' >>temp.js
	cat fab-boilerplate.js temp.js >fab.js
