import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import INavigable from "../../core/navigation/INavigable";
import NavigationManager from "../../core/navigation/NavigationManager";

export default class TicketsController extends EventDispatcher implements INavigable {
	
	private static routeList:Array<string> = ["tickets"];
	
	private mTicketsView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
		this.Init("tickets");
	}
	
	public Init(aAction:string):void {
		this.mTicketsView = new AbstractView();
		this.mTicketsView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mTicketsView.LoadTemplate("templates/tickets/tickets.html");
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("ticketsView");
		document.getElementById("core").removeChild(scheduleHTMLElement);
		
		this.mTicketsView.Destroy();
		this.mTicketsView = null;
	}
	
	public GetRouteList():Array<string> {
		return TicketsController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mTicketsView.RenderTemplate({});
		this.mTicketsView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
}