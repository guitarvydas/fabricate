/// helpers
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

function vcompilefab (v) {
    // v is { tracing: boolean, traceDepth: int, src: String, grammarName: undefined, grammars: undefined, fab : undefined, ohm: function, compilefab: undefined}
    tracing = v.tracing;
    traceDepth = v.traceDepth;
    return compilefab (v.src, v.ohm);
}

function compilefab (fabsrc, ohmlang) {
    // expand the string fabsrc into JavaScript suitable for
    // inclusion as a semantic object for Ohm.js
    //
    var s = '';

    var generatedObject = {};
    

    // Step 1a. Create (internal) fab transpiler. 
    var internalgrammar = ohmlang.grammar (fabGrammar);
    var fabcst = internalgrammar.match (fabsrc);

    if (fabcst.failed ()) {
        // return [false, "FABRICATOR: syntax error\n(Use Ohm-Editor to debug fabricator specification (grammar: fab.ohm))\n\n" + internalgrammar.trace (fabsrc)];
	console.error (internalgrammar);
        return [false, "FABRICATOR: syntax error\n(Use Ohm-Editor to debug fabricator specification) rightmostPosition=" + fabcst.getRightmostFailurePosition() + '\n' + fabsrc];
    }
    // Step 1b. Transpile User's FAB spec to a JS object (for use with Ohm-JS)
    try {
        var sem = internalgrammar.createSemantics ();
        sem.addOperation ('_fab', semObject);
        var generatedFabWalker = sem (fabcst);
        var generated = generatedFabWalker._fab ();
        return [true, generated];
    } catch (err) {
        var msg = "error generating code from FAB specification<br><br>" + err.message;
        return [false, msg];
    }
}


var tracing = false;
var traceDepth = 0;

const fabGrammar =
      String.raw`
FAB {
top = spaces name spaces "{" spaces rule+ spaces "}" spaces more*
more = name spaces "{" spaces rule* spaces "}" spaces
rule = applySyntactic<RuleLHS> spaces "=" spaces rewriteString
RuleLHS = name "[" Param+ "]"
rewriteString = "‛" char* "’" spaces
char =
  | "«" nonBracketChar* "»" -- eval
  | ~"’" ~"]]" any     -- raw
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

// xxx

//// top = spaces name spaces "{" spaces rule+ spaces "}" spaces more*
// top [ws1 name ws2 lb ws4 @rule ws5 rb ws3 @more] = [[{
// ${rule}
    // _terminal: function () { return this.sourceString; },
    // _iter: function (...children) { return children.map(c => c._fab ()); },
    // spaces: function (x) { return this.sourceString; },
    // space: function (x) { return this.sourceString; }
// }
// ]]

const semObject = {

    top : function (_ws1,_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3,_more) { 
        _ruleEnter ("top");

        var ws1 = _ws1._fab ();
        var name = _name._fab ();
        var ws2 = _ws2._fab ();
        var lb = _lb._fab ();
        var ws4 = _ws4._fab ();
        var rule = _rule._fab ().join ('');
        var ws5 = _ws5._fab ();
        var rb = _rb._fab ();
        var ws3 = _ws3._fab ();
        var more = _more._fab ().join ('');
        var _result = `{
${rule}${more}
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fab ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
`; 
        _ruleExit ("top");
        return _result; 
    },

    more : function (_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3) { 
        _ruleEnter ("top");

        var name = _name._fab ();
        var ws2 = _ws2._fab ();
        var lb = _lb._fab ();
        var ws4 = _ws4._fab ();
        var rule = _rule._fab ().join ('');
        var ws5 = _ws5._fab ();
        var rb = _rb._fab ();
        var ws3 = _ws3._fab ();
        var _result = `
${rule}
`; 
        _ruleExit ("top");
        return _result; 
    },


    ////
    
    // rule [lhs ws1 keq ws2 rws] = [[${lhs}${rws}
    // _ruleExit ("${getRuleName ()}");
    // },
    // ]]


    rule : function (_lhs,_ws1,_keq,_ws2,_rws) { 
        _ruleEnter ("rule");

        var lhs = _lhs._fab ();
        var ws1 = _ws1._fab ();
        var keq = _keq._fab ();
        var ws2 = _ws2._fab ();
        var rws = _rws._fab ();
        var _result = `${lhs}
_ruleExit ("${getRuleName ()}");
return ${rws}
},
`; 
        _ruleExit ("rule");
        return _result; 
    },
    ////
    
    // RuleLHS [name lb @Params rb] = [[${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}${Params}
    // ]]
    RuleLHS : function (_name,_lb,_Params,_rb) { 
        _ruleEnter ("RuleLHS");

        var name = _name._fab ();
        var lb = _lb._fab ();
        var Params = _Params._fab ().join ('');
        var rb = _rb._fab ();
        var _result = `${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}${Params}
`; 
        _ruleExit ("RuleLHS");
        return _result; 
    },
    
    ////


    // rewriteString [sb @cs se ws] = [[return \`${cs}\`;]]
    rewriteString : function (_sb,_cs,_se,_ws) { 
        _ruleEnter ("rewriteString");

        var sb = _sb._fab ();
        var cs = _cs._fab ().join ('');
        var se = _se._fab ();
        var ws = _ws._fab ();
        var _result = `\`${cs}\`;`; 
        _ruleExit ("rewriteString");
        return _result; 
    },


    ////
    // char_eval [lb name rb] = [[\$\{${name}\}]]
    // char_raw [c] = [[${c}]]
    char_eval : function (_lb,_cs,_rb) { 
        _ruleEnter ("char_eval");

        var lb = _lb._fab ();
        var name = _cs._fab ().join ('');
        var rb = _rb._fab ();
        var _result = `\$\{${name}\}`; 
        _ruleExit ("char_eval");
        return _result; 
    },
    
    char_raw : function (_c) { 
        _ruleEnter ("char_raw");

        var c = _c._fab ();
        var _result = `${c}`; 
        _ruleExit ("char_raw");
        return _result; 
    },
    ////
    
    // name [c @cs] = [[${c}${cs}]]
    // nameRest [c] = [[${c}]]

    name : function (_c,_cs) { 
        _ruleEnter ("name");

        var c = _c._fab ();
        var cs = _cs._fab ().join ('');
        var _result = `${c}${cs}`; 
        _ruleExit ("name");
        return _result; 
    },
    
    nameRest : function (_c) { 
        _ruleEnter ("nameRest");

        var c = _c._fab ();
        var _result = `${c}`; 
        _ruleExit ("nameRest");
        return _result; 
    },

    ////


    // Param_plus [name k] = [[\nvar ${name} = _${name}._fab ().join ('');]]
    // Param_star [name k] = [[\nvar ${name} = _${name}._fab ().join ('');]]
    // Param_opt [name k] = [[\nvar ${name} = _${name}._fab ().join ('');]]
    // Param_flat [name] = [[\nvar ${name} = _${name}._fab ();]]


    Param_plus : function (_name,_k) { 
        _ruleEnter ("Param_plus");

        var name = _name._fab ();
        var k = _k._fab ();
        var _result = `\nvar ${name} = _${name}._fab ().join ('');`; 
        _ruleExit ("Param_plus");
        return _result; 
    },
    
    Param_star : function (_name,_k) { 
        _ruleEnter ("Param_star");

        var name = _name._fab ();
        var k = _k._fab ();
        var _result = `\nvar ${name} = _${name}._fab ().join ('');`; 
        _ruleExit ("Param_star");
        return _result; 
    },
    
    Param_opt : function (_name,_k) { 
        _ruleEnter ("Param_opt");

        var name = _name._fab ();
        var k = _k._fab ();
        var _result = `\nvar ${name} = _${name}._fab ().join ('');`; 
        _ruleExit ("Param_opt");
        return _result; 
    },
    
    Param_flat : function (_name) { 
        _ruleEnter ("Param_flat");

        var name = _name._fab ();
        var _result = `\nvar ${name} = _${name}._fab ();`; 
        _ruleExit ("Param_flat");
        return _result; 
    },
    
    ////

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fab ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
};
// yyy

