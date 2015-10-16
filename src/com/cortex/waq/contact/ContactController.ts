import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import INavigable from "../../core/navigation/INavigable";
import NavigationManager from "../../core/navigation/NavigationManager";

export default class ContactController extends EventDispatcher implements INavigable {
	
	private static routeList:Array<string> = ["contact"];
	
	private mContactView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void {
		this.mContactView = new AbstractView();
		this.mContactView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mContactView.LoadTemplate("templates/contact/contact.html");
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("contactView");
		document.getElementById("core").removeChild(scheduleHTMLElement);
		
		this.mContactView.Destroy();
		this.mContactView = null;
	}
	
	public GetRouteList():Array<string> {
		return ContactController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mContactView.RenderTemplate({});
		this.mContactView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
}