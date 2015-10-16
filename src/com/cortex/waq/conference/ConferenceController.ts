import EventDispatcher = 	require("../../core/event/EventDispatcher");

import Conference = 		require("./data/Conference")
import ConferenceModel = 	require("./ConferenceModel")

class ConferenceController extends EventDispatcher {
	
	private mConferences:Array<Conference>;
	
	constructor() {
		super();
		
		this.Init();
	}
	
	private Init():void {
		this.mConferences = ConferenceModel.GetInstance().GetConferences();
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

export = ConferenceController;