import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Conference from "./data/Conference";

export default class ConferenceModel extends AbstractModel {
	
	private static mInstance:ConferenceModel;
	
	public static GetInstance():ConferenceModel {
		if (ConferenceModel.mInstance == null)
			ConferenceModel.mInstance = new ConferenceModel();
		return ConferenceModel.mInstance;
	}
	
	private mConferences:Array<Conference>;
	
	constructor() {
		super();
		
		this.mConferences = [];
		this.CreateConferences();
	}
	
	private CreateConferences():void {
		this.Fetch("json/waq/conferences.json");
	}
	
	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {
		super.OnJSONLoadSuccess(aJSONData, aURL);
		
		var json:Array<Object> = aJSONData;
		var totalItems:number = json.length;
		for (var i:number = 0; i < totalItems; i++) {
			var conference:Conference = new Conference();
			conference.FromJSON(json[i]);
			this.mConferences.push(conference);
		}
	}
	
	public GetConferences():Array<Conference> {
		return this.mConferences;
	}
	
}