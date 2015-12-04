export default class Templating {

	private static cache:any = {};
	/* tslint:disable */
	private static regexp:RegExp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
	private static encReg:RegExp = /[<>&"'\x00]/g;
	/* tslint:enable */
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

        var f = !/[^\w\-\.:]/.test(aTemplate) ? Templating.cache[aTemplate] = Templating.cache[aTemplate] ||
                Templating.Render(Templating.load(aTemplate)) :
                    new Function(
                        Templating.arg + ",Templating",
                        "var _e=Templating.encode" +
						Templating.helper +
						",_s='" +
						aTemplate.replace(Templating.regexp, this.func) +
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
	/* tslint:disable */
    private static encode(s) {
	/* tslint:enable */
        /*jshint eqnull:true */
        return (s == null ? "" : "" + s).replace(
            Templating.encReg,
            function (c) {
                return Templating.encMap[c] || "";
            }
        );
    }
}
