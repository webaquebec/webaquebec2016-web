import ListComponent = 			require("../../core/component/ListComponent");

import MouseTouchEvent = 		require("../../core/mouse/event/MouseTouchEvent");

import MVCEvent = 				require("../../core/mvc/event/MVCEvent");
import AbstractController = 	require("../../core/mvc/AbstractController");
import AbstractView = 			require("../../core/mvc/AbstractView");

import INavigable = 			require("../../core/navigation/INavigable");
import NavigationManager = 		require("../../core/navigation/NavigationManager");

import Conference = 			require("../conference/data/Conference");
import ConferenceController = 	require("../conference/ConferenceController");

class ScheduleController extends AbstractController implements INavigable {
	
	private static routeList:Array<string> = ["schedule"];
	
	private mScheduleView:AbstractView;
	private mListComponent:ListComponent;
	private mConferenceController:ConferenceController;
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void {
		this.mScheduleView = new AbstractView();
		this.mScheduleView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
		this.mConferenceController = new ConferenceController();
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("scheduleView");
		document.getElementById("core").removeChild(scheduleHTMLElement);
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mScheduleView.Destroy();
		this.mScheduleView = null;
	}
	
	public GetRouteList():Array<string> {
		return ScheduleController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mScheduleView.RenderTemplate({});
		this.mScheduleView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		this.mScheduleView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mListComponent = new ListComponent();
		this.mListComponent.Init("schedule-conferenceContainer");
		
		this.GenerateConferences();
	}
	
	private GenerateConferences():void {
		var conferences:Array<Conference> = this.mConferenceController.GetConferences();
		
		var max:number = conferences.length;
		for (var i:number = 0; i < max; i++) {
			var conferenceQuickView:AbstractView = new AbstractView();
			conferenceQuickView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnConferenceTemplateLoaded, this);
			this.mListComponent.AddComponent(conferenceQuickView, "templates/conference/conferenceToggleView.html", conferences[i]);
		}
	}
	
	private OnConferenceTemplateLoaded(aEvent:MVCEvent):void {
		var conference:Conference = <Conference>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		this.mScheduleView.AddClickControl(document.getElementById("conference-conferenceToggleView" + conference.ID));
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if (element.id.indexOf("conference-conferenceToggleView") >= 0) {
			this.OnConferenceToggleClicked(element.id);
		}
	}
	
	private OnConferenceToggleClicked(aElementId:string):void {
		var conferenceViewId:string = aElementId.split("conference-conferenceToggleView")[1];
		var element:HTMLElement = document.getElementById("conference-conferenceDetails" + conferenceViewId);
		element.className = element.className == "" ? "conference-collapsed" : "";
	}
	
}

export = ScheduleController;