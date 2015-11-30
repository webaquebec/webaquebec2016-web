import EventDispatcher from "../../core/event/EventDispatcher";

import Conference from "./data/Conference";
import ConferenceModel from "./ConferenceModel";

export default class ConferenceController extends EventDispatcher {

	private mConferences:Array<Conference>;

	constructor() {
		super();

		this.Init();
	}

	private Init():void {
		//this.mConferences = ConferenceModel.GetInstance().GetConferences();
	}

	public GetConferences():Array<Conference> {
		return this.mConferences;
	}

	public GetConferencesWithFilters(aFilterIds:Array<number>):void {

	}

	public GetConferencesForDate():void {

	}

	public GetConferencesOfSpeaker():void {

	}
}
