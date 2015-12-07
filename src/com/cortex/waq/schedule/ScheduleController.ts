import ListComponent from "../../core/component/ListComponent";
import ComponentEvent from "../../core/component/event/ComponentEvent";
import ComponentBinding from "../../core/component/ComponentBinding";
import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import Conference from "../conference/data/Conference";
import ConferenceController from "../conference/ConferenceController";
import EConferenceType from "../conference/EConferenceType";

export default class ScheduleController extends EventDispatcher {

	private mScheduleView:AbstractView;

	private mListComponent:ListComponent;
	private mConferenceController:ConferenceController;

	private mDayFilters:Array<number>;
	private mTypeFilters:Array<string>;

	private mEventDays:Array<number> = [18,19,20];
	private mEventTypes:Array<string> = [
											EConferenceType.PROGRAMMATION,
											EConferenceType.MARKETING,
											EConferenceType.ENTREPREUNEURSHIP,
											EConferenceType.DESIGN,
											EConferenceType.WORKSHOP,
											EConferenceType.PLENARY
										];

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mDayFilters = new Array<number>();
		this.mTypeFilters = this.mEventTypes.slice(0, this.mEventTypes.length);

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

		var eventDaysLength = this.mEventDays.length;

		for(var i:number = 0; i < eventDaysLength; i++){

			this.mScheduleView.AddClickControl(document.getElementById("schedule-btn-"+ this.mEventDays[i]));
		}

		var eventTypesLength = this.mEventTypes.length;

		for(i = 0; i < eventTypesLength; i++){

			this.mScheduleView.AddClickControl(document.getElementById("tag-"+ this.mEventTypes[i]));
		}

		this.mListComponent = new ListComponent();
		this.mListComponent.Init("schedule-content");

		this.GenerateConferences();
	}

	private GenerateConferences():void {

		var conferences:Array<Conference> = this.mConferenceController.GetConferences();

		var max:number = conferences.length;

		for (var i:number = 0; i < max; i++) {

			this.mListComponent.AddComponent(new ComponentBinding(new AbstractView(), conferences[i]));
		}

		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this. OnConferenceTemplateLoaded, this);
		this.mListComponent.LoadWithTemplate("templates/conference/conference.html");
	}

	private FilterEventByType(aType:string):void{

		var filterIndex:number = this.mTypeFilters.indexOf(aType);

		var button:HTMLElement = document.getElementById("tag-" + aType);

		if(filterIndex < 0) {

			this.mTypeFilters.push(aType);
			button.classList.add("tag-on");
			button.classList.remove("tag-off");

		} else {

			this.mTypeFilters.splice(filterIndex, 1);
			button.classList.remove("tag-on");
			button.classList.add("tag-off");
		}

		this.RenderFilteredEvent();
	}

	private FilterEventByDate(aDay:number):void{

		var filterIndex:number = this.mDayFilters.indexOf(aDay);

		var button:HTMLElement = document.getElementById("schedule-btn-" + aDay);

		if(filterIndex < 0) {

			this.mDayFilters.push(aDay);
			button.classList.add("selected");
			button.classList.remove("schedule-btn-date");

		} else {

			this.mDayFilters.splice(filterIndex, 1);
			button.classList.remove("selected");
			button.classList.add("schedule-btn-date");
		}

		this.RenderFilteredEvent();
	}

	private RenderFilteredEvent():void {

		this.mListComponent.RemoveAllComponents();

		var componentBindings:Array<ComponentBinding> = this.mListComponent.GetComponentBindings();

		var componentBindingsLength:number = componentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			var componentBinding:ComponentBinding = componentBindings[i];
			var conference:Conference = <Conference>componentBinding.Data;

			for(var j:number = 0, dayFiltersLength = this.mDayFilters.length; j < dayFiltersLength; j++){

				if(conference.day == this.mDayFilters[j]) {

					for(var k:number = 0, typeFiltersLength = this.mTypeFilters.length; k < typeFiltersLength; k++) {

						if(conference.tagCss == this.mTypeFilters[k]){
							this.mListComponent.AddComponent(componentBinding);
							break;
						}
					}
					break;
				}
			}
		}
	}

	private OnConferenceTemplateLoaded(aEvent:ComponentEvent):void {

		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this. OnConferenceTemplateLoaded, this);

		var componentBindings:Array<ComponentBinding> = this.mListComponent.GetComponentBindings();

		var componentBindingsLength:number = componentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			var componentBinding:ComponentBinding = componentBindings[i];

			componentBinding.HTML = document.getElementById("conference-view-" + componentBinding.Data.ID);

			this.mScheduleView.AddClickControl(componentBinding.HTML);
		}

		this.FilterEventByDate(this.mEventDays[0]);
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {

		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id.indexOf("conference-view-") >= 0) {
			this.OnConferenceToggleClicked(element.id);
		} else if(element.id.indexOf("schedule-btn") >= 0) {
			this.FilterEventByDate(Number(element.id.split("schedule-btn-")[1]));
		} else if(element.id.indexOf("tag-") >= 0) {
			this.FilterEventByType(element.id.split("tag-")[1]);
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
