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
	echo 'const semObject = ' >>temp.js
	# sed -e 's/`/\\`/g' gen.js >modifiedgen.js
	# cat modifiedgen.js >>temp.js
	cat gen.js >>temp.js
	echo ';' >>temp.js
	cat fab-boilerplate.js temp.js >fab.js
