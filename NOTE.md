fmt-js 
ohm: `  | "\\‛" -- beginquote`
fmt: uses raw JS:
```
char_beginquote: function (_c) { 
        _ruleEnter ("char_beginquote");

        var c = _c._fmt ();
        var _result = `${c}`; 
        _ruleExit ("char_beginquote");
        return _result; 
    },
```

fab
fab.ohm: `  | "\\‛" -- beginquote`
fab.fab: `char_beginquote [c] = ‛«c»’`
generates: 
```
...
char_beginquote: function (_c) {
_ruleEnter ("char_beginquote");
var c = _c._fmt ();

_ruleExit ("char_beginquote");
return `${c}`;
},
...
```
