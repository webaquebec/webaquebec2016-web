import EventDispatcher from "../../core/event/EventDispatcher";

import MVCEvent from "../../core/mvc/event/MVCEvent";

import Conference from "./data/Conference";
import ConferenceModel from "./ConferenceModel";

export default class ConferenceController extends EventDispatcher {

	private mConferenceModel:ConferenceModel;
	private mConferences:Array<Conference>;

	constructor() {
		super();

		this.Init();
	}

	private Init():void {
		this.mConferenceModel = new ConferenceModel();
		this.mConferenceModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);

		//this.mConferences = ConferenceModel.GetInstance().GetConferences();
	}

	private OnJSONLoaded(aEvent:MVCEvent):void {
		this.mConferenceModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
		this.mConferences = this.mConferenceModel.GetConferences();
		this.DispatchEvent(aEvent);
	}

	public GetConferences():Array<Conference> {
		return this.mConferences;
	}

	public GetConferencesWithFilters(aFilterIds:Array<number>):void {
		//TODO
	}

	public GetConferencesForDate():void {
		//TODO
	}

	public GetConferencesOfSpeaker():void {
		//TODO
	}
}
