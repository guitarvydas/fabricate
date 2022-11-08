
const fmtGrammar = String.raw`
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
        var _result = `{
${rule}${more}
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
`; 
        _ruleExit ("top");
        return _result; 
    },

    more: function (_name,_ws2,_lb,_ws4,_rule,_ws5,_rb,_ws3) { 
        _ruleEnter ("top");

        var name = _name._fmt ();
        var ws2 = _ws2._fmt ();
        var lb = _lb._fmt ();
        var ws4 = _ws4._fmt ();
        var rule = _rule._fmt ().join ('');
        var ws5 = _ws5._fmt ();
        var rb = _rb._fmt ();
        var ws3 = _ws3._fmt ();
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


    rule: function (_lhs,_ws1,_keq,_ws2,_rws) { 
        _ruleEnter ("rule");

        var lhs = _lhs._fmt ();
        var ws1 = _ws1._fmt ();
        var keq = _keq._fmt ();
        var ws2 = _ws2._fmt ();
        var rws = _rws._fmt ();
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
    RuleLHS: function (_name,_lb,_Params,_rb) { 
        _ruleEnter ("RuleLHS");

        var name = _name._fmt ();
        var lb = _lb._fmt ();
        var Params = _Params._fmt ().join ('');
        var rb = _rb._fmt ();
        var _result = `${name}: function (${extractFormals(Params)}) {\n_ruleEnter ("${name}");${setRuleName (name)}${Params}
`; 
        _ruleExit ("RuleLHS");
        return _result; 
    },
    
    ////


    // rewriteString [sb @cs se ws] = [[return \`${cs}\`;]]
    rewriteString: function (_sb,_cs,_se,_ws) { 
        _ruleEnter ("rewriteString");

        var sb = _sb._fmt ();
        var cs = _cs._fmt ().join ('');
        var se = _se._fmt ();
        var ws = _ws._fmt ();
        var _result = `\`${cs}\`;`; 
        _ruleExit ("rewriteString");
        return _result; 
    },


    ////
    // char_eval [lb name rb] = [[\$\{${name}\}]]
    // char_raw [c] = [[${c}]]
    char_eval: function (_lb,_cs,_rb) { 
        _ruleEnter ("char_eval");

        var lb = _lb._fmt ();
        var name = _cs._fmt ().join ('');
        var rb = _rb._fmt ();
        var _result = `\$\{${name}\}`; 
        _ruleExit ("char_eval");
        return _result; 
    },
    
    char_beginquote: function (_c) { 
        _ruleEnter ("char_beginquote");

        var c = _c._fmt ();
        var _result = `${c}`; 
        _ruleExit ("char_beginquote");
        return _result; 
    },
    char_endquote: function (_c) { 
        _ruleEnter ("char_endquote");

        var c = _c._fmt ();
        var _result = `${c}`; 
        _ruleExit ("char_quote");
        return _result; 
    },
    char_raw: function (_c) { 
        _ruleEnter ("char_raw");

        var c = _c._fmt ();
        var _result = `${c}`; 
        _ruleExit ("char_raw");
        return _result; 
    },
    ////
    
    // name [c @cs] = [[${c}${cs}]]
    // nameRest [c] = [[${c}]]

    name: function (_c,_cs) { 
        _ruleEnter ("name");

        var c = _c._fmt ();
        var cs = _cs._fmt ().join ('');
        var _result = `${c}${cs}`; 
        _ruleExit ("name");
        return _result; 
    },
    
    nameRest: function (_c) { 
        _ruleEnter ("nameRest");

        var c = _c._fmt ();
        var _result = `${c}`; 
        _ruleExit ("nameRest");
        return _result; 
    },

    ////


    // Param_plus [name k] = [[\nvar ${name} = _${name}._fmt ().join ('');]]
    // Param_star [name k] = [[\nvar ${name} = _${name}._fmt ().join ('');]]
    // Param_opt [name k] = [[\nvar ${name} = _${name}._fmt ().join ('');]]
    // Param_flat [name] = [[\nvar ${name} = _${name}._fmt ();]]


    Param_plus: function (_name,_k) { 
        _ruleEnter ("Param_plus");

        var name = _name._fmt ();
        var k = _k._fmt ();
        var _result = `\nvar ${name} = _${name}._fmt ().join ('');`; 
        _ruleExit ("Param_plus");
        return _result; 
    },
    
    Param_star: function (_name,_k) { 
        _ruleEnter ("Param_star");

        var name = _name._fmt ();
        var k = _k._fmt ();
        var _result = `\nvar ${name} = _${name}._fmt ().join ('');`; 
        _ruleExit ("Param_star");
        return _result; 
    },
    
    Param_opt: function (_name,_k) { 
        _ruleEnter ("Param_opt");

        var name = _name._fmt ();
        var k = _k._fmt ();
        var _result = `\nvar ${name} = _${name}._fmt ().join ('');`; 
        _ruleExit ("Param_opt");
        return _result; 
    },
    
    Param_flat: function (_name) { 
        _ruleEnter ("Param_flat");

        var name = _name._fmt ();
        var _result = `\nvar ${name} = _${name}._fmt ();`; 
        _ruleExit ("Param_flat");
        return _result; 
    },
    
    ////

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}

;
