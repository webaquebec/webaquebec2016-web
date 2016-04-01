import Route from "./Route";

export default class Router {

  private static mInstance:Router;

  public static GetInstance():Router {
    if (Router.mInstance == null) {
      Router.mInstance = new Router()
    }
    return Router.mInstance;
  }

  private mRoutes:Route[] = new Array<Route>();

  private mMap:{[route:string]:Route} = {};

  private static REFERENCE:string = "routie";

  constructor() {

    this.AddListener();

    window[Router.REFERENCE] = this;
  }

  public AddHandler(aPath:string, aCallback:()=>void):void {

    var s = aPath.split(" ");

    var name = (s.length == 2) ? s[0] : null;
    aPath = (s.length == 2) ? s[1] : s[0];

    if (!this.mMap[aPath]) {

      this.mMap[aPath] = new Route(aPath, name);
      this.mRoutes.push(this.mMap[aPath]);
    }

    this.mMap[aPath].AddHandler(aCallback);
  }

  public Remove(aPath:string, aCallback:()=>void):void {

    var route:Route = this.mMap[aPath];

    if (!route) {
      return;
    }

    route.RemoveHandler(aCallback);
  }

  public RemoveAll():void {

    this.mMap = {};
    this.mRoutes = [];
  }

  public Navigate(aPath:string, aSilent:boolean = false):void {

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

  public GetHash():string {
    return window.location.hash.substring(1);
  }

	public GetRoutes():Array<Route>{

		return(this.mRoutes.slice(0, this.mRoutes.length));
	}

  private CheckRoute(aHash:string, aRoute:Route):boolean {

    var params = [];

    if (aRoute.Match(aHash, params)) {

      aRoute.Run(params);
      return true;
    }
    return false;
  }

  public Reload():void {

    var hash:string = this.GetHash();

    for (var i:number = 0, c:number = this.mRoutes.length; i < c; i++) {

      var route:Route = this.mRoutes[i];

      if (this.CheckRoute(hash, route)) {
        return;
      }
    }
  }

  private AddListener():void {

    if (window.addEventListener) {
      window.addEventListener("hashchange", this.Reload.bind(this), false);
    } else {
      window["attachEvent"]("onhashchange", this.Reload.bind(this));
    }
  }

  private RemoveListener():void {

    if (window.removeEventListener) {
      window.removeEventListener("hashchange", this.Reload.bind(this));
    } else {
      window["detachEvent"]("onhashchange", this.Reload.bind(this));
    }
  }
}
