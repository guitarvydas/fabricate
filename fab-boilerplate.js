// helpers
function _ruleInit () {
}

function traceSpaces () {
    var s = '';
    var n = traceDepth;
    while (n > 0) {
        s += ' ';
        n -= 1;
    }
    s += `[${traceDepth.toString ()}]`;
    return s;
}

function _ruleEnter (ruleName) {
    if (tracing) {
        traceDepth += 1;
        var s = traceSpaces ();
        s += 'enter: ';
        s += ruleName.toString ();
        console.log (s);
    }
}

function _ruleExit (ruleName) {
    if (tracing) {
        var s = traceSpaces ();
        traceDepth -= 1;
        s += 'exit: ';
        s += ruleName.toString ();
        console.log (s);
    }
}

function getFabGrammar () {
    return fabGrammar;
}

  // helper functions
  var ruleName = "???";
  function setRuleName (s) { ruleName = s; return "";}
  function getRuleName () { return ruleName; }

/// end helpers

function vcompilefmt (v) {
    // v is { tracing: boolean, traceDepth: int, src: String, grammarName: undefined, grammars: undefined, fmt : undefined, ohm: function, compilefmt: undefined}
    tracing = v.tracing;
    traceDepth = v.traceDepth;
    return compilefmt (v.src, v.ohm);
}

function compilefmt (fmtsrc, ohmlang) {
    // expand the string fmtsrc into JavaScript suitable for
    // inclusion as a semantic object for Ohm.js
    //
    var s = '';

    var generatedObject = {};
    

    // Step 1a. Create (internal) fmt transpiler. 
    var internalgrammar = ohmlang.grammar (fabGrammar);
    var fmtcst = internalgrammar.match (fmtsrc);

    if (fmtcst.failed ()) {
        // return [false, "FORMAT: syntax error\n(Use Ohm-Editor to debug format specification (grammar: fmt.ohm))\n\n" + internalgrammar.trace (fmtsrc)];
	console.error (internalgrammar);
        return [false, "FORMAT: syntax error\n(Use Ohm-Editor to debug format specification) rightmostPosition=" + fmtcst.getRightmostFailurePosition() + '\n' + fmtsrc];
    }
    // Step 1b. Transpile User's FMT spec to a JS object (for use with Ohm-JS)
    try {
        var sem = internalgrammar.createSemantics ();
        sem.addOperation ('_fmt', semObject);
        var generatedFmtWalker = sem (fmtcst);
        var generated = generatedFmtWalker._fmt ();
        return [true, generated];
    } catch (err) {
        var msg = "error generating code from FMT specification<br><br>" + err.message;
        return [false, msg];
    }
}


var tracing = false;
var traceDepth = 0;

function extractFormals (s) {
    var s0 = s
        .replace (/\n/g,',')
        .replace (/var [A-Za-z0-9_]+ = /g,'')
        .replace (/\._[^;]+;/g,'')
        .replace (/,/,'')
    ;
    return s0;
}

var varNameStack = [];

