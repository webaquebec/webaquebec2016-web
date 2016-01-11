import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Conference from "./data/Conference";

import ProfilesModel from "../profiles/ProfilesModel";
import TimeSlotModel from "./TimeSlotModel";
import SubjectTypeModel from "./SubjectTypeModel";

import EConfig from "../main/EConfig";

export default class ConferenceModel extends AbstractModel {

	private mConferences:Array<Conference>;

	private mProfilesModel:ProfilesModel;
	private mTimeSlotModel:TimeSlotModel;
	private mSubjectTypeModel:SubjectTypeModel;

	constructor() {

		super();

		this.mProfilesModel = ProfilesModel.GetInstance();
		this.mTimeSlotModel = TimeSlotModel.GetInstance();
		this.mSubjectTypeModel = SubjectTypeModel.GetInstance();

		this.mConferences = [];
	}

	public FetchConferences():void {

		if (!this.mProfilesModel.IsLoaded()){

			this.mProfilesModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnProfilesLoaded, this);
			this.mProfilesModel.FetchProfiles();

		} else if(!this.mTimeSlotModel.IsLoaded()){

			this.mTimeSlotModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnTimeSlotsLoaded, this);
			this.mTimeSlotModel.FetchTimeSlots();

		} else if(!this.mSubjectTypeModel.IsLoaded()){

			this.mSubjectTypeModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnSubjectTypesLoaded, this);
			this.mSubjectTypeModel.FetchSubjectTypes();

		} else {

			this.Fetch(EConfig.BASE_URL + "session?per_page=" + EConfig.PER_PAGE);
		}
	}

	private OnSubjectTypesLoaded(aEvent:MVCEvent):void{

		this.mSubjectTypeModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnSubjectTypesLoaded, this);

		this.FetchConferences();
	}

	private OnTimeSlotsLoaded(aEvent:MVCEvent):void{

		this.mTimeSlotModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnTimeSlotsLoaded, this);

		this.FetchConferences();
	}

	private OnProfilesLoaded(aEvent:MVCEvent):void {

		this.mProfilesModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnProfilesLoaded, this);

		this.FetchConferences();
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<any> = aJSONData;

		var totalItems:number = json.length;

		for (var i:number = 0; i < totalItems; i++) {

			var conference:Conference = new Conference();

			conference.FromJSON(json[i]);

			conference.speaker = this.mProfilesModel.GetProfileByID(conference.speakerID);
			conference.timeSlot = this.mTimeSlotModel.GetTimeSlotByID(conference.timeSlotID);
			conference.subjectType = this.mSubjectTypeModel.GetSubjectTypeByID(conference.subjectTypeID);

			this.mConferences.push(conference);
		}

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetConferenceByID(aConferenceID:number):Conference {

		for(var i:number = 0,  max = this.mConferences.length; i < max; i++) {

			if(this.mConferences[i].conferenceID == aConferenceID){

				return this.mConferences[i];
			}
		}

		return null;
	}

	public GetConferences():Array<Conference> {

		return this.mConferences;
	}
}
