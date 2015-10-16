import Route from "./Route";

export default class Router {
	
	private mRoutes:Route[] = new Array<Route>();
	
	private mMap:{[route:string]:Route} = {};
	
	private static REFERENCE:string = "routie";
	
	private mOldReference:Router = window[Router.REFERENCE];
	
	constructor(aRoute:string, aCallback:() => void) {
		
		if (typeof aCallback == 'function') {
			
			this.AddHandler(aRoute, aCallback);
			this.Reload();
			
		} else if (typeof aCallback === 'undefined') {
			
			this.navigate(aRoute);
		}
		
		this.AddListener();
		
		window[Router.REFERENCE] = this;
	}
	
	public AddHandler(aPath:string, aCallback:()=>void):void {
		
		var s = aPath.split(' ');
		
		var name = (s.length == 2) ? s[0] : null;
		aPath = (s.length == 2) ? s[1] : s[0];
		
		if (!this.mMap[aPath]) {
			
			this.mMap[aPath] = new Route(aPath, name);
			this.mRoutes.push(this.mMap[aPath]);
		}
		
		this.mMap[aPath].AddHandler(aCallback);
	}
	
	private Lookup(aPath:void, aParam:any):string {
		
		var routesLength:number = this.mRoutes.length;
		
		for (var i = 0, c = routesLength; i < c; i++) {
			
			var route:Route = this.mRoutes[i];
			
			if (route.Path == name) {
				
				return route.ToURL(aParam);
			}
		}
		
		return null;
	}
	
	private Remove(aPath:string, aCallback:()=>void):void {
		
		var route:Route = this.mMap[aPath];
		
		if (!route)
			return;
			
		route.RemoveHandler(aCallback);
	}
	
	private RemoveAll():void {
		
		this.mMap = {};
		this.mRoutes = [];
	}
	
	private navigate(aPath:string, aSilent:boolean = false):void {
		
		if (aSilent) {
			this.RemoveListener();
		}
		
		setTimeout(function() {
			
			window.location.hash = aPath;
			
			if (aSilent) {
				
				setTimeout(function() { 
					this.AddListener();
				}, 1);
			}
		
		}, 1);
	}
	
	private NoConflict():Router {
		
		window[Router.REFERENCE] = this.mOldReference;
		return this;
	};
	
	private GetHash():string {
		
		return window.location.hash.substring(1);
	}
	
	private CheckRoute(aHash:string, aRoute:Route):boolean {
		
		var params = [];
		
		if (aRoute.Match(aHash, params)) {
			
			aRoute.Run(params);
			return true;
		}
		return false;
	}
	
	private Reload():void {
		
		var hash:string = this.GetHash();
		
		for (var i:number = 0, c:number = this.mRoutes.length; i < c; i++) {
			
			var route:Route = this.mRoutes[i];
			
			if (this.CheckRoute(hash, route))
				return;
		}
	}
	
	private AddListener():void {
		
		if (window.addEventListener) {
			window.addEventListener('hashchange', this.Reload.bind(this), false);
		} else {
			window["attachEvent"]('onhashchange', this.Reload.bind(this));
		}
	}
	
	private RemoveListener():void {
		
		if (window.removeEventListener) {
			window.removeEventListener('hashchange', this.Reload.bind(this));
		} else {
			window["detachEvent"]('onhashchange', this.Reload.bind(this));
		}
	}
}