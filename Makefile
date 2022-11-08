dev:
	rm -f fab.js
	(make fab.js)

all: diff

diff:
	diff -w gen.js gen2.js

fab.js: gen.js fab.ohm
	echo >temp.js
	echo 'const fmtGrammar = String.raw`' >>temp.js
	cat fab.ohm >>temp.js
	echo '`;' >>temp.js
	cat fab-boilerplate.js temp.js >fab.js
