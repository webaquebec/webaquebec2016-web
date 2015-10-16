import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import INavigable from "../../core/navigation/INavigable";
import NavigationManager from "../../core/navigation/NavigationManager";

export default class HomeController extends EventDispatcher implements INavigable {
	
	private static routeList:Array<string> = ["", "home"];
	
	private mHomeView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void {
		this.mHomeView = new AbstractView();
		this.mHomeView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mHomeView.LoadTemplate("templates/home/home.html");
	}
	
	public Destroy():void {
		var homeHTMLElement:HTMLElement = document.getElementById("homeView");
		document.getElementById("core").removeChild(homeHTMLElement);
		
		this.mHomeView.Destroy();
		this.mHomeView = null;
	}
	
	public GetRouteList():Array<string> {
		return HomeController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mHomeView.RenderTemplate({});
		this.mHomeView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		if (document.readyState == "complete" || document.readyState == "interactive") {
			// this.OnDeviceReady();
		}
		else {
			// document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
		}
	}
	
}