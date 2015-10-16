export default class Route {
	
	private mName:string;
	private mPath:string;
	private mKeys:{name:string, optional:boolean}[];
	private mCallbacks:(()=>void)[];
	private mCallbacksLength:number = 0;
	private mParams:any;
	private mRegex:RegExp;
	
	constructor(aPath:string, aName:string) {
		
		this.mName = aName;
		this.mPath = aPath;
		this.mKeys = new Array<{name:string, optional:boolean}>();
		this.mCallbacks = new Array<()=>void>();
		this.mParams = {};
		
		this.mRegex = this.PathToRegExp(this.mPath, this.mKeys, false, false);
	}
	
	public AddHandler(aCallback:()=>void):void {
		
		this.mCallbacks.push(aCallback);
		++this.mCallbacksLength;
	}

	public RemoveHandler(aCallback:()=>void):void {
		
		for (var i:number = 0; i < this.mCallbacksLength; i++) {
			
			var callback:()=>void = this.mCallbacks[i];
			
			if (aCallback == callback) {
				
				this.mCallbacks.splice(i, 1);
				--this.mCallbacksLength;
				return;
			}
		}
	}
	
	public get Path():string { return this.mPath; }
	
	public Run(params:any):void {
		
		for (var i = 0, c = this.mCallbacks.length; i < c; i++) {
			
			this.mCallbacks[i].apply(this, params);
		}
	}
	
	public Match(aPath:string, aParams:any):boolean{
		
		var execArray:RegExpExecArray = this.mRegex.exec(aPath);
		
		if (!execArray) return false;
		
		for (var i:number = 1, len:number = execArray.length; i < len; ++i) {
			
			var key = this.mKeys[i - 1];
			
			var value:string = ('string' == typeof execArray[i]) ? decodeURIComponent(execArray[i]) : execArray[i];
			
			if (key) {
				this.mParams[key.name] = value;
			}
			
			aParams.push(value);
		}
		
		return true;
	}
	
	public ToURL(params:any):string {
		
		var path:string = this.mPath;
		
		for (var param in params) {
			path = path.replace('/:'+param, '/'+params[param]);
		}
		
		path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
		
		if (path.indexOf(':') != -1) {
			throw new Error('missing parameters for url: '+path);
		}
		
		return path;
	}

	private PathToRegExp(aPath:any, aKeys:{name:string, optional:boolean}[], aSensitive:boolean, aStrict:boolean):RegExp {
		
		if (aPath instanceof RegExp) return aPath;
		if (aPath instanceof Array) aPath = '(' + aPath.join('|') + ')';
		
		aPath = aPath
			.concat(aStrict ? '' : '/?')
			.replace(/\/\(/g, '(?:/')
			.replace(/\+/g, '__plus__')
			.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, 
			function(_, slash, format, key, capture, optional){
				
				aKeys.push({ name: key, optional: !! optional });
				
				slash = slash || '';
				
				return '' + (optional ? '' : slash) + '(?:' + 
							(optional ? slash : '') +
							(format || '') + 
							(capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + 
							(optional || '');
			})
			.replace(/([\/.])/g, '\\$1')
			.replace(/__plus__/g, '(.+)')
			.replace(/\*/g, '(.*)');
		
		return new RegExp('^' + aPath + '$', aSensitive ? '' : 'i');
	}
}