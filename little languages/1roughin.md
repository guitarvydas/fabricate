## Goal
To create an SCN[^scn] (little language) that can be used to specify *semantics* code that is compatible with Ohm-JS.

We will call this SCN "fab", a short form for "fabricator".

This SCN is intended to allow specification of code generation ("transpiling", "compiling") by creating character strings.

The specification language - *fab* - creates strings using only two (2) kinds of things:
1. characters - verbatim text
2. text values captured by the Ohm-JS pattern-matching engine.

Trying to make something general purpose is painful.

Focusing on a single, specific purpose is often easier.

This very restricted form of input characters and text values seems to be overly simple, yet, it turns out that it is incredibly powerful.  It can cover just about any type of code generation necessary.

As an aside, mathematical notation consists of pure textual manipulation. The rules -  such as immutability - are put in place simply to allow of manipulation of text.


[^scn]:SCN mean Solution Centric Notation, i.e. a "little language"

Ohm-JS works in two phases. The first phase is a pattern match specified by something called a *grammar*. The second phase is called *semantics*. At the moment, Ohm-JS expects the *grammar* to be written in a little language that looks a lot like BNF[^bnf] , and, it expects the *semantics* to be written in a language called Javascript.  Javascript is a general purpose language that is capable of much more than simply building strings.  It turns out that our *fabricator* only needs to build strings. Writing only string-generating code in Javascript is over-kill, like using a Ferrari engine in a lawn mower[engine].  Using Javascript to narrowly describe only string generation tends to obfuscate the purpose of the code - Javascript requires a lot of scaffolding boilerplate code before it can generate strings.  In addition, programmers need to exhibit discipline in avoiding the use other features of JavaScipt that aren't directly related to string generation.

It is exactly this combination of requirements that leads to the design of an SCN. We need to access only a very small subset of the available features in a general purpose language.  In this case, we only need to use the string-generation features of Javascript.

[^bnf]: Backus Naur Form, a fancy name for a set of rules for pattern-matching text.  https://en.wikipedia.org/wiki/Backus–Naur_form

[^engine]: This wording comes from private conversations with Jim Cordy.

[[1-2needed]]
[[1-3normalization]]
