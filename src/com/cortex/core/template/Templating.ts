export default class Templating {
	
	private static cache:any = {};
	
	private static regexp:RegExp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
	private static encReg:RegExp = /[<>&"'\x00]/g;
	
	private static encMap = {
		"<"   : "&lt;",
		">"   : "&gt;",
		"&"   : "&amp;",
		"\""  : "&quot;",
		"'"   : "&#39;"
	};
	
	private static arg:string = "o";
    private static helper:string = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);},include=function(s,d){_s+=tmpl(s,d);}";
	
    public static Render(aTemplate:string, aData?:any) {
		
        var f = !/[^\w\-\.:]/.test(aTemplate) ? this.cache[aTemplate] = this.cache[aTemplate] ||
                this.Render(this.load(aTemplate)) :
                    new Function(
                        this.arg + ',tmpl',
                        "var _e=tmpl.encode" + 
						this.helper + 
						",_s='" +
						aTemplate.replace(this.regexp, this.func) +
						"';return _s;"
                    );
        return aData ? f(aData, this) : function (aData) {
            return f(aData, this);
        };
    }
    
    private static load(id) {
        return document.getElementById(id).innerHTML;
    }
    
    private static func(s, p1, p2, p3, p4, p5) {
        if (p1) { // whitespace, quote and backspace in HTML context
            return {
                "\n": "\\n",
                "\r": "\\r",
                "\t": "\\t",
                " " : " "
            }[p1] || "\\" + p1;
        }
        if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
            if (p2 === "=") {
                return "'+_e(" + p3 + ")+'";
            }
            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
        }
        if (p4) { // evaluation start tag: {%
            return "';";
        }
        if (p5) { // evaluation end tag: %}
            return "_s+='";
        }
    }

    private static encode(s) {
        /*jshint eqnull:true */
        return (s == null ? "" : "" + s).replace(
            this.encReg,
            function (c) {
                return this.encMap[c] || "";
            }
        );
    }
}