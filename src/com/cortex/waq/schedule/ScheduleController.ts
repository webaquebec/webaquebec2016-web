import MVCEvent = 			require("../../core/mvc/event/MVCEvent");
import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = 		require("../../core/mvc/AbstractView");

import INavigable = 		require("../../core/navigation/INavigable");
import NavigationManager = 	require("../../core/navigation/NavigationManager");

class ScheduleController extends AbstractController implements INavigable {
	
	private static routeList:Array<string> = ["schedule"];
	
	private mScheduleView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void {
		this.mScheduleView = new AbstractView();
		this.mScheduleView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("scheduleView");
		document.getElementById("core").removeChild(scheduleHTMLElement);
		
		this.mScheduleView.Destroy();
		this.mScheduleView = null;
	}
	
	public GetRouteList():Array<string> {
		return ScheduleController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mScheduleView.RenderTemplate({});
		this.mScheduleView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
}

export = ScheduleController;