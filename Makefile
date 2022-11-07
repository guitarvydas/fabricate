all: diff

diff:
	diff -w gen.js gen2.js
