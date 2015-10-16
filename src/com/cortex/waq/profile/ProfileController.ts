import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import INavigable from "../../core/navigation/INavigable";
import NavigationManager from "../../core/navigation/NavigationManager";

export default class ProfileController extends EventDispatcher implements INavigable {
	
	private static routeList:Array<string> = ["profile"];
	
	private mProfileView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void {
		this.mProfileView = new AbstractView();
		this.mProfileView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfileView.LoadTemplate("templates/profile/profile.html");
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("profileView");
		document.getElementById("core").removeChild(scheduleHTMLElement);
		
		this.mProfileView.Destroy();
		this.mProfileView = null;
	}
	
	public GetRouteList():Array<string> {
		return ProfileController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mProfileView.RenderTemplate({});
		this.mProfileView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
}