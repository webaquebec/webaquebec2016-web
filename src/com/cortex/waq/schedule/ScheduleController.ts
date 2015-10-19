import ListComponent from "../../core/component/ListComponent";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import Conference from "../conference/data/Conference";
import ConferenceController from "../conference/ConferenceController";

export default class ScheduleController extends EventDispatcher {
	
	private static routeList:Array<string> = ["schedule"];
	
	private mScheduleView:AbstractView;
	private mListComponent:ListComponent;
	private mConferenceController:ConferenceController;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		this.mScheduleView = new AbstractView();
		this.mScheduleView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
		this.mConferenceController = new ConferenceController();
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("schedule-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mScheduleView.Destroy();
		this.mScheduleView = null;
	}
	
	public GetRouteList():Array<string> {
		return ScheduleController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mScheduleView.RenderTemplate({});
		this.mScheduleView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
		
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