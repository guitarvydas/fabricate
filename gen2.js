
{
top: function (_ws1,_name,_ws2,_lb,_ws3,_rule,_ws4,_rb,_ws5,_more) {
_ruleEnter ("top");
var ws1 = _ws1._fmt ();
var name = _name._fmt ();
var ws2 = _ws2._fmt ();
var lb = _lb._fmt ();
var ws3 = _ws3._fmt ();
var rule = _rule._fmt ().join ('');
var ws4 = _ws4._fmt ();
var rb = _rb._fmt ();
var ws5 = _ws5._fmt ();
var more = _more._fmt ().join ('');
return `
{
«rule»«more»
    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
`;
_ruleExit ("top");
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
return `
«rule»
`;
_ruleExit ("more");
},
rule: function (_lhs,_ws1,_keq,_ws2,_rws) {
_ruleEnter ("rule");
var lhs = _lhs._fmt ();
var ws1 = _ws1._fmt ();
var keq = _keq._fmt ();
var ws2 = _ws2._fmt ();
var rws = _rws._fmt ();
return `«lhs»«rws»
_ruleExit ("«getRuleName ()»");
},
`;
_ruleExit ("rule");
},
RuleLHS: function (_name,_lb,_Params,_rb) {
_ruleEnter ("RuleLHS");
var name = _name._fmt ();
var lb = _lb._fmt ();
var Params = _Params._fmt ().join ('');
var rb = _rb._fmt ();
return `«name»: function («extractFormals(Params)») {\n_ruleEnter ("«name»");«setRuleName (name)»«Params»
`;
_ruleExit ("RuleLHS");
},
rewriteString: function (_sb,_cs,_se,_ws) {
_ruleEnter ("rewriteString");
var sb = _sb._fmt ();
var cs = _cs._fmt ().join ('');
var se = _se._fmt ();
var ws = _ws._fmt ();
return `return \`«cs»\`;`;
_ruleExit ("rewriteString");
},
char_eval: function (_lb,_nonBracketChar,_rb) {
_ruleEnter ("char_eval");
var lb = _lb._fmt ();
var nonBracketChar = _nonBracketChar._fmt ().join ('');
var rb = _rb._fmt ();
return `\««nonBracketChar»\»`;
_ruleExit ("char_eval");
},
char_raw: function (_c) {
_ruleEnter ("char_raw");
var c = _c._fmt ();
return `«c»`;
_ruleExit ("char_raw");
},
nonBracketChar: function (_c) {
_ruleEnter ("nonBracketChar");
var c = _c._fmt ();
return `«c»`;
_ruleExit ("nonBracketChar");
},
name: function (_c,_cs) {
_ruleEnter ("name");
var c = _c._fmt ();
var cs = _cs._fmt ().join ('');
return `«c»«cs»`;
_ruleExit ("name");
},
nameRest: function (_c) {
_ruleEnter ("nameRest");
var c = _c._fmt ();
return `«c»`;
_ruleExit ("nameRest");
},
Param_plus: function (_name,_k) {
_ruleEnter ("Param_plus");
var name = _name._fmt ();
var k = _k._fmt ();
return `\nvar «name» = _«name»._fmt ().join ('');`;
_ruleExit ("Param_plus");
},
Param_star: function (_name,_k) {
_ruleEnter ("Param_star");
var name = _name._fmt ();
var k = _k._fmt ();
return `\nvar «name» = _«name»._fmt ().join ('');`;
_ruleExit ("Param_star");
},
Param_opt: function (_name,_k) {
_ruleEnter ("Param_opt");
var name = _name._fmt ();
var k = _k._fmt ();
return `\nvar «name» = _«name»._fmt ().join ('');`;
_ruleExit ("Param_opt");
},
Param_flat: function (_name) {
_ruleEnter ("Param_flat");
var name = _name._fmt ();
return `\nvar «name» = _«name»._fmt ();`;
_ruleExit ("Param_flat");
},

    _terminal: function () { return this.sourceString; },
    _iter: function (...children) { return children.map(c => c._fmt ()); },
    spaces: function (x) { return this.sourceString; },
    space: function (x) { return this.sourceString; }
}
