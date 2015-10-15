import MVCEvent = 			require("../../core/mvc/event/MVCEvent");
import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = 		require("../../core/mvc/AbstractView");

import INavigable = 		require("../../core/navigation/INavigable");
import NavigationManager = 	require("../../core/navigation/NavigationManager");

class TicketsController extends AbstractController implements INavigable {
	
	private static routeList:Array<string> = ["tickets"];
	
	private mTicketsView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
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

export = TicketsController;