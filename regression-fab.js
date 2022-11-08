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


const fabGrammar = String.raw`
FMT {
top = spaces name spaces "{" spaces rule+ spaces "}" spaces more*
more = name spaces "{" spaces rule* spaces "}" spaces
rule = applySyntactic<RuleLHS> spaces "=" spaces rewriteString
RuleLHS = name "[" Param+ "]"
rewriteString = "‛" char* "’" spaces
char =
  | "«" nonBracketChar* "»" -- eval
  | "\\‛" -- beginquote
  | "\\’" -- endquote
  | ~"\\‛" ~"’" any     -- raw
nonBracketChar = ~"»" ~"«"  ~"’" ~"]]" any
name = letter nameRest*
nameRest = "_" | alnum
Param =
  | name "+" -- plus
  | name "*" -- star
  | name "?" -- opt
  | name     -- flat
comment = "//" (~"\n" any)* "\n"
space += comment
}

`;
const semObject =
{
top: function (_ws1,_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3,_more) {
_ruleEnter ("top");
var ws1 = _ws1._fmt ();
var name = _name._fmt ();
var ws2 = _ws2._fmt ();
var lb = _lb._fmt ();
var ws4 = _ws4._fmt ();
var rule = _rule._fmt ().join ('');
var ws5 = _ws5._fmt ();
var rb = _rb._fmt ();
var ws3 = _ws3._fmt ();
var more = _more._fmt ().join ('');

_ruleExit ("top");
return `
{
${rule}${more}
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
`;
},
more: function (_name,_ws1,_lb,_ws2,_rule,_ws3,_rb,_ws4) {
_ruleEnter ("more");
var name = _name._fmt ();
var ws1 = _ws1._fmt ();
var lb = _lb._fmt ();
var ws2 = _ws2._fmt ();
var rule = _rule._fmt ().join ('');
var ws3 = _ws3._fmt ();
var rb = _rb._fmt ();
var ws4 = _ws4._fmt ();

_ruleExit ("more");
return `
${rule}
`;
},
rule: function (_lhs,_ws1,_keq,_ws2,_rws) {
_ruleEnter ("rule");
var lhs = _lhs._fmt ();
var ws1 = _ws1._fmt ();
var keq = _keq._fmt ();
var ws2 = _ws2._fmt ();
var rws = _rws._fmt ();

_ruleExit ("rule");
return `${lhs}
_ruleExit ("${getRuleName ()}");
return ${rws};
},
`;
},
RuleLHS: function (_name,_lb,_Params,_rb) {
_ruleEnter ("RuleLHS");
var name = _name._fmt ();
var lb = _lb._fmt ();
var Params = _Params._fmt ().join ('');
var rb = _rb._fmt ();

_ruleExit ("RuleLHS");
return `${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}${Params}
`;
},
rewriteString: function (_sb,_cs,_se,_ws) {
_ruleEnter ("rewriteString");
var sb = _sb._fmt ();
var cs = _cs._fmt ().join ('');
var se = _se._fmt ();
var ws = _ws._fmt ();

_ruleExit ("rewriteString");
return `\`${cs}\``;
},
char_eval: function (_lb,_name,_rb) {
_ruleEnter ("char_eval");
var lb = _lb._fmt ();
var name = _name._fmt ().join ('');
var rb = _rb._fmt ();

_ruleExit ("char_eval");
return `\$\{${name}\}`;
},
char_beginquote: function (_c) {
_ruleEnter ("char_beginquote");
var c = _c._fmt ();

_ruleExit ("char_beginquote");
return `${c}`;
},
char_endquote: function (_c) {
_ruleEnter ("char_endquote");
var c = _c._fmt ();

_ruleExit ("char_endquote");
return `${c}`;
},
char_raw: function (_c) {
_ruleEnter ("char_raw");
var c = _c._fmt ();

_ruleExit ("char_raw");
return `${c}`;
},
nonBracketChar: function (_c) {
_ruleEnter ("nonBracketChar");
var c = _c._fmt ();

_ruleExit ("nonBracketChar");
return `${c}`;
},
name: function (_c,_cs) {
_ruleEnter ("name");
var c = _c._fmt ();
var cs = _cs._fmt ().join ('');

_ruleExit ("name");
return `${c}${cs}`;
},
nameRest: function (_c) {
_ruleEnter ("nameRest");
var c = _c._fmt ();

_ruleExit ("nameRest");
return `${c}`;
},
Param_plus: function (_name,_k) {
_ruleEnter ("Param_plus");
var name = _name._fmt ();
var k = _k._fmt ();

_ruleExit ("Param_plus");
return `\nvar ${name} = _${name}._fmt ().join ('');`;
},
Param_star: function (_name,_k) {
_ruleEnter ("Param_star");
var name = _name._fmt ();
var k = _k._fmt ();

_ruleExit ("Param_star");
return `\nvar ${name} = _${name}._fmt ().join ('');`;
},
Param_opt: function (_name,_k) {
_ruleEnter ("Param_opt");
var name = _name._fmt ();
var k = _k._fmt ();

_ruleExit ("Param_opt");
return `\nvar ${name} = _${name}._fmt ().join ('');`;
},
Param_flat: function (_name) {
_ruleEnter ("Param_flat");
var name = _name._fmt ();

_ruleExit ("Param_flat");
return `\nvar ${name} = _${name}._fmt ();`;
},

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
;