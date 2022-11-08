dev:
	rm -f fab.js regression-fab.js
	(make fab.js)
	(make regression-fab.js)


fab.js: fab.ohm hybrid-fab-js.js
	echo >temp.js
	echo 'const fabGrammar = String.raw`' >>temp.js
	cat fab.ohm >>temp.js
	echo '`;' >>temp.js
	echo 'const semObject =' >>temp.js
	cat hybrid-fab-js.js >>temp.js
	echo ';' >>temp.js
	cat fab-boilerplate.js temp.js >fab.js

regression-fab.js: fab.ohm sem.js
	echo >temp.js
	echo 'const fabGrammar = String.raw`' >>temp.js
	cat fab.ohm >>temp.js
	echo '`;' >>temp.js
	echo 'const semObject =' >>temp.js
	# cat hybrid-fab-js.js >>temp.js
	cat sem.js >>temp.js
	echo ';' >>temp.js
	cat fab-boilerplate.js temp.js >regression-fab.js

diff:
	diff -wBb sem.js regression-sem.js
