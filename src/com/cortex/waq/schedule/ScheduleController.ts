import ListComponent from "../../core/component/ListComponent";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import Conference from "../conference/data/Conference";
import ConferenceController from "../conference/ConferenceController";

export default class ScheduleController extends EventDispatcher {

	private mScheduleView:AbstractView;

	private mListComponent:ListComponent;
	private mConferenceController:ConferenceController;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mConferenceController = new ConferenceController();
		this.mConferenceController.AddEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("schedule-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mScheduleView.Destroy();
		this.mScheduleView = null;
	}

	private OnJSONLoaded(aEvent:MVCEvent):void {
		this.mConferenceController.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);

		this.mScheduleView = new AbstractView();
		this.mScheduleView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mScheduleView.RenderTemplate({});
		this.mScheduleView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		this.mScheduleView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent = new ListComponent();
		this.mListComponent.Init("schedule-content");

		this.GenerateConferences();
	}

	private GenerateConferences():void {
		var conferences:Array<Conference> = this.mConferenceController.GetConferences();

		var max:number = conferences.length;
		for (var i:number = 0; i < max; i++) {
			var conferenceView:AbstractView = new AbstractView();
			conferenceView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnConferenceTemplateLoaded, this);
			this.mListComponent.AddComponent(conferenceView, "templates/conference/conference.html", conferences[i]);
		}
	}

	private OnConferenceTemplateLoaded(aEvent:MVCEvent):void {
		var conference:Conference = <Conference>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		this.mScheduleView.AddClickControl(document.getElementById("conference-view-" + conference.ID));
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id.indexOf("conference-view-") >= 0) {
			this.OnConferenceToggleClicked(element.id);
		}
	}

	private OnConferenceToggleClicked(aElementId:string):void {
		var conferenceViewId:string = aElementId.split("conference-view-")[1];
		var element:HTMLElement = document.getElementById("conference-toggleElement-" + conferenceViewId);
		var collapsed = "conference-content conference-collapsed";
		var expanded = "conference-content conference-expanded"
		element.className = element.className === collapsed ? expanded : collapsed;
	}

}
