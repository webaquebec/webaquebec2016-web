import EConfig from "../main/EConfig";

import ListComponent from "../../core/component/ListComponent";
import ComponentEvent from "../../core/component/event/ComponentEvent";
import ComponentBinding from "../../core/component/ComponentBinding";
import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import Conference from "../conference/data/Conference";
import SubjectType from "../conference/data/SubjectType";
import ConferenceModel from "../conference/ConferenceModel";
import SubjectTypeModel from "../conference/SubjectTypeModel";

import { Router } from "cortex-toolkit-js-router";
import CompanyModel from "../profiles/CompanyModel";

export default class ScheduleController extends EventDispatcher {

	private mScheduleView:AbstractView;

	private mListComponent:ListComponent;

	private mConferenceModel:ConferenceModel;
	private mSubjectTypeModel:SubjectTypeModel;
	private mCompanyModel:CompanyModel;

	private mCurrentConference:Conference;

	private mDayFilters:Array<number>;
	private mTypeFilters:Array<SubjectType>;

	private mEventDays:Array<any>;

	private mReady:boolean;

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mSubjectTypeModel = SubjectTypeModel.GetInstance();
		this.mCompanyModel = CompanyModel.GetInstance();
		this.mConferenceModel = ConferenceModel.GetInstance();

		if(this.mConferenceModel.IsLoaded()) {

			this.OnJSONLoaded(null);

		} else {

			this.mConferenceModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
			this.mConferenceModel.FetchConferences();
		}
	}

	public Destroy():void {

		var scheduleHTMLElement:HTMLElement = document.getElementById("schedule-view");

		if(scheduleHTMLElement){
			document.getElementById("content-current").removeChild(scheduleHTMLElement);
		}

		if(this.mListComponent){

			this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this. OnConferenceTemplateLoaded, this);
			this.mListComponent.Destroy();
		}
		this.mListComponent = null;

		if(this.mScheduleView) {

			this.mScheduleView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
			this.mScheduleView.RemoveEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
			this.mScheduleView.Destroy();
		}
		this.mScheduleView = null;

		if(this.mDayFilters) { this.mDayFilters.length = 0; }
		this.mDayFilters = null;

		if(this.mTypeFilters) { this.mTypeFilters.length = 0;}
		this.mTypeFilters = null;

		if(this.mEventDays) { this.mEventDays.length = 0;}
		this.mEventDays = null;

		if(this.mConferenceModel){

			this.mConferenceModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
		}
		this.mConferenceModel = null;
		this.mSubjectTypeModel = null;

		this.mReady = false;
	}

	public IsReady():boolean{ return this.mReady; }

	private OnJSONLoaded(aEvent:MVCEvent):void {

		this.mConferenceModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);

		this.mDayFilters = [];
		this.mTypeFilters = [];

		this.mEventDays = [
			{
				day:"Mercredi",
				letter:"M",
				month:"avril",
				date:"6"
			},
			{
				day:"Jeudi",
				letter:"J",
				month:"avril",
				date:"7"
			},
			{
				day:"Vendredi",
				letter:"V",
				month:"avril",
				date:"8"
			}
		]

		if(this.mCompanyModel.IsLoaded()) {

			this.OnCompaniesLoaded(null);

		}else{

			this.mCompanyModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnCompaniesLoaded, this);
			this.mCompanyModel.FetchCompanies();
		}
	}

	private OnCompaniesLoaded(aEvent:MVCEvent):void {

		this.mCompanyModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnCompaniesLoaded, this);

		this.mScheduleView = new AbstractView();
		this.mScheduleView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		var title:string = 'Horaire des conférences - ' + EConfig.TITLE;
		var description:string = 'Une programmation réputée pour sa diversité et la qualité de ses conférenciers, tant locale qu’internationale.'

		document.title = title;
		document.getElementsByName('og:title')[0].setAttribute('content', title);
		document.getElementsByName('description')[0].setAttribute('content', description);
		document.getElementsByName('og:description')[0].setAttribute('content', description);
		document.getElementsByName('og:image')[0].setAttribute('content', "http://webaquebec.org/img/share-fb.jpg");
		document.getElementsByName("og:url")[0].setAttribute("content", window.location.href);

		this.mScheduleView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		var subjectTypes = this.mSubjectTypeModel.GetSubjectTypes();

		document.getElementById("content-loading").innerHTML += this.mScheduleView.RenderTemplate(	{
																										subjectTypes:subjectTypes,
																										dates:this.mEventDays
																									});
        var headerTitle:HTMLElement = document.getElementById("header-content-title");
        headerTitle.innerHTML = "<h1>Horaire des conférences</h1>";
        var headerTitleH1:HTMLElement = (<HTMLElement>headerTitle.getElementsByTagName("H1")[0]);
        headerTitleH1.style.marginTop = "0.9em";
		this.mScheduleView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		var eventDaysLength = this.mEventDays.length;

		for(var i:number = 0; i < eventDaysLength; i++){

			this.mScheduleView.AddClickControl(document.getElementById("schedule-btn-"+ this.mEventDays[i].date));
		}

		var subjectTypesLength = subjectTypes.length;

		for(i = 0; i < subjectTypesLength; i++){

			this.mScheduleView.AddClickControl(document.getElementById("tag-"+ subjectTypes[i].subjectSlug));
		}

		this.mScheduleView.AddClickControl(document.getElementById("schedule-option"));

		this.mListComponent = new ListComponent();
		this.mListComponent.Init("schedule-content");

		this.GenerateConferences();
	}

	private SortConferenceByTime(aDay:number):Array<Conference>{

		var conferences:Array<Conference> = this.mConferenceModel.GetConferencesByDay(aDay);

		conferences.sort(function(a:Conference, b:Conference){

			if(a.timeSlot.hours > b.timeSlot.hours) {
				return 1;
			} else if(a.timeSlot.hours == b.timeSlot.hours) {

				if(a.timeSlot.minutes > b.timeSlot.minutes) {
					return 1;
				} else if(a.timeSlot.minutes == b.timeSlot.minutes){
					return 0;
				} else { return -1; }

			} else { return -1; }
		})

		return conferences;
	}

	private GenerateConferences():void {

		var conferences:Array<Conference> = this.SortConferenceByTime(this.mEventDays[0].date);
		conferences = conferences.concat(this.SortConferenceByTime(this.mEventDays[1].date));
		conferences = conferences.concat(this.SortConferenceByTime(this.mEventDays[2].date));

		var max:number = conferences.length;

		for (var i:number = 0; i < max; i++) {

			var conference:Conference = conferences[i];

			var binding:ComponentBinding = new ComponentBinding(new AbstractView(), conference);

			if(conference.break){

				binding.Template = "templates/conference/break.html";

			}else{

				binding.Template = "templates/conference/conference.html";
			}

			this.mListComponent.AddComponent(binding);
		}

		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this. OnConferenceTemplateLoaded, this);
		this.mListComponent.LoadWithTemplate();
	}

	private ShowOptionMenu():void{

		var menu:HTMLElement = document.getElementById("schedule-menu-option");
		var content:HTMLElement = document.getElementById("schedule-content-wrapper");

		var scheduleButton1:HTMLElement = document.getElementById("schedule-btn-" + this.mEventDays[0].date);
		var scheduleButton2:HTMLElement = document.getElementById("schedule-btn-" + this.mEventDays[1].date);
		var scheduleButton3:HTMLElement = document.getElementById("schedule-btn-" + this.mEventDays[2].date);
		var scheduleButtonOption:HTMLElement = document.getElementById("schedule-option");

		if(menu.classList.contains("schedule-menu-option-shown")){

			scheduleButton1.classList.remove("schedule-btn-date-hidden");
			scheduleButton2.classList.remove("schedule-btn-date-hidden");
			scheduleButton3.classList.remove("schedule-btn-date-hidden");
			scheduleButtonOption.classList.remove("schedule-btn-option-full");
			menu.classList.remove("schedule-menu-option-shown");
			content.classList.remove("hidden");

		} else {

			scheduleButton1.classList.add("schedule-btn-date-hidden");
			scheduleButton2.classList.add("schedule-btn-date-hidden");
			scheduleButton3.classList.add("schedule-btn-date-hidden");
			scheduleButtonOption.classList.add("schedule-btn-option-full");
			menu.classList.add("schedule-menu-option-shown");
			content.classList.add("hidden");
		}
	}

	private FilterEventByType(aSubjectType:SubjectType):void{

		var filterIndex:number = this.mTypeFilters.indexOf(aSubjectType);

		var button:HTMLElement = document.getElementById("tag-" + aSubjectType.subjectSlug);

		if(filterIndex < 0) {

			this.mTypeFilters.push(aSubjectType);
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

		var button:HTMLElement;

		if(this.mDayFilters.length > 0) {

			button = document.getElementById("schedule-btn-" + this.mDayFilters.pop());
			button.classList.remove("selected");
			button.classList.add("schedule-btn-date");
		}

		this.mDayFilters.push(aDay);
		button  = document.getElementById("schedule-btn-" + aDay);
		button.classList.add("selected");
		button.classList.remove("schedule-btn-date");

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

				if(conference.timeSlot.day == this.mDayFilters[j]) {

					var typeFiltersLength:number = this.mTypeFilters.length;

					if(typeFiltersLength == 0 || conference.break){

						this.mListComponent.AddComponent(componentBinding);

					}else{

						for(var k:number = 0; k < typeFiltersLength; k++) {

							if(conference.subjectType == this.mTypeFilters[k]){

								this.mListComponent.AddComponent(componentBinding);
								break;
							}
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

			if((<Conference>componentBinding.Data).break) { continue; }

			this.mScheduleView.AddClickControl(componentBinding.HTML);
			this.mScheduleView.AddClickControl(document.getElementById("speaker" + componentBinding.Data.ID));
		}

		this.FilterEventByDate(this.mEventDays[0].date);

		this.mReady = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {

		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id.indexOf("conference-view-") >= 0) {

			var conferenceID:string = element.id.split("conference-view-")[1];
			var conference:Conference = <Conference>this.mListComponent.GetDataByID(conferenceID);

			if(conference == this.mCurrentConference){

				this.ShowConference(this.mCurrentConference);

			} else {

				Router.GetInstance().Navigate("!"+conference.slug);
			}

		} else if(element.id.indexOf("schedule-btn") >= 0) {

			this.FilterEventByDate(Number(element.id.split("schedule-btn-")[1]));

		} else if(element.id.indexOf("tag-") >= 0) {

			this.FilterEventByType(this.GetSubjectTypeBySlug(element.id.split("tag-")[1]));

		}else if(element.id == "schedule-option") {

			this.ShowOptionMenu();

		} else if(element.id.indexOf("speaker") >= 0) {

			var conferenceID:string = element.id.split("speaker")[1];
			var conference:Conference = <Conference>this.mListComponent.GetDataByID(conferenceID);

			Router.GetInstance().Navigate("!"+conference.speaker.slug);
		}
	}

	private GetSubjectTypeBySlug(aSubjectSlug:string):SubjectType{

		var subjectTypes:Array<SubjectType> = this.mSubjectTypeModel.GetSubjectTypes();

		for(var i:number = 0, max = subjectTypes.length; i < max; i++){

			if(subjectTypes[i].subjectSlug == aSubjectSlug) { return subjectTypes[i]; }
		}

		return null;
	}

	public ShowConference(aConference:Conference):void {

		var title:string = aConference.shortTitle + ', ' + aConference.speaker.firstName + ' ' +
							aConference.speaker.lastName + ', ' + aConference.speaker.subtitle;

		var description:string = aConference.description;

		document.title = title;
		document.getElementsByName('og:title')[0].setAttribute('content', title);
		document.getElementsByName('description')[0].setAttribute('content', description);
		document.getElementsByName('og:description')[0].setAttribute('content', description);
		document.getElementsByName('og:image')[0].setAttribute('content', aConference.speaker.photo);
		document.getElementsByName("og:url")[0].setAttribute("content", window.location.href);

		var element:HTMLElement;

		var collapsed = "conference-content conference-collapsed";
		var expanded = "conference-content conference-expanded";

		if(	aConference != this.mCurrentConference && this.mCurrentConference != null){

			element = document.getElementById("conference-toggleElement-" + this.mCurrentConference.ID);

			if(element){ element.className = collapsed; }
		}

		this.mCurrentConference = aConference;

		if(this.mDayFilters.indexOf(aConference.timeSlot.day) < 0){

			this.FilterEventByDate(aConference.timeSlot.day);
		}

		element = document.getElementById("conference-toggleElement-" + this.mCurrentConference.ID);

		if(element.className === collapsed) {

			element.className = expanded;
			document.getElementById("schedule-content-wrapper").scrollTop =
				element.offsetTop - document.getElementById("schedule-header").scrollHeight;

		}else{

			element.className = collapsed;
		}
	}
}
