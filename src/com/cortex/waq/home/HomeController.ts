import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = require("../../core/mvc/AbstractView");

import MVCEvent = require("../../core/mvc/event/MVCEvent");

import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");

class HomeController extends AbstractController implements INavigable {
	
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

export = HomeController;