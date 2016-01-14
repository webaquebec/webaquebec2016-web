import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Conference from "./data/Conference";

import ProfilesModel from "../profiles/ProfilesModel";
import Profile from "../profiles/data/Profile";
import TimeSlotModel from "./TimeSlotModel";
import SubjectTypeModel from "./SubjectTypeModel";
import RoomModel from "./RoomModel";

import EConfig from "../main/EConfig";
import Spinner from "../spinner/Spinner";

export default class ConferenceModel extends AbstractModel {

	private static mInstance:ConferenceModel;

	private mConferences:Array<Conference>;

	private mProfilesModel:ProfilesModel;
	private mTimeSlotModel:TimeSlotModel;
	private mSubjectTypeModel:SubjectTypeModel;
	private mRoomModel:RoomModel;

	private mDataLoaded:boolean = false;

	constructor() {

		super();

		this.mProfilesModel = ProfilesModel.GetInstance();
		this.mTimeSlotModel = TimeSlotModel.GetInstance();
		this.mSubjectTypeModel = SubjectTypeModel.GetInstance();
		this.mRoomModel = RoomModel.GetInstance();

		this.mConferences = [];
	}

	public IsLoaded():boolean { return this.mDataLoaded; }

	public FetchConferences():void {

        Spinner.GetInstance().Show();
		if (!this.mProfilesModel.IsSpeakersLoaded()){

			this.mProfilesModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnProfilesLoaded, this);
			this.mProfilesModel.FetchSpeakers();

		} else if(!this.mTimeSlotModel.IsLoaded()){

			this.mTimeSlotModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnTimeSlotsLoaded, this);
			this.mTimeSlotModel.FetchTimeSlots();

		} else if(!this.mSubjectTypeModel.IsLoaded()){

			this.mSubjectTypeModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnSubjectTypesLoaded, this);
			this.mSubjectTypeModel.FetchSubjectTypes();

		} else if(!this.mRoomModel.IsLoaded()){

			this.mRoomModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnRoomLoaded, this);
			this.mRoomModel.FetchRooms();

		} else {

			this.Fetch(EConfig.BASE_URL + "session?per_page=" + EConfig.PER_PAGE);
		}
	}

	private OnRoomLoaded(aEvent:MVCEvent):void{

		this.mRoomModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnRoomLoaded, this);

		this.FetchConferences();
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

			conference.speaker = this.mProfilesModel.GetSpeakerByID(conference.speakerID);
			conference.timeSlot = this.mTimeSlotModel.GetTimeSlotByID(conference.timeSlotID);
			conference.subjectType = this.mSubjectTypeModel.GetSubjectTypeByID(conference.subjectTypeID);
			conference.room = this.mRoomModel.GetRoomByID(conference.roomID);

			if(conference.room == null){
				conference.room = this.mRoomModel.GetRooms()[0];
			}

			if(conference.timeSlot == null){
				conference.timeSlot = this.mTimeSlotModel.GetTimeSlots()[0];
			}

			if(conference.speaker == null){
				conference.speaker = this.mProfilesModel.GetSpeakers()[0];
			}

			if(conference.subjectType == null){
				conference.subjectType = this.mSubjectTypeModel.GetSubjectTypes()[0];
			}

			this.mConferences.push(conference);
		}

        Spinner.GetInstance().Hide();

		this.mDataLoaded = true;

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

	public GetConferenceBySpeaker(aSpeaker:Profile):Conference{

		for(var i:number = 0, max = this.mConferences.length; i < max; i++){

			if(this.mConferences[i].speaker == aSpeaker) {
				return this.mConferences[i];
			}
		}


		return null;
	}

	public GetConferencesByDay(aDay:any):Array<Conference>{

		var conferencesByDate:Array<Conference> = [];

		for(var i:number = 0, max = this.mConferences.length; i < max; i++){

			if(this.mConferences[i].timeSlot.day == aDay){
				conferencesByDate.push(this.mConferences[i]);
			}
		}

		return(conferencesByDate);
	}

	public GetConferences():Array<Conference> {

		return this.mConferences.slice(0, this.mConferences.length);
	}

	public static GetInstance():ConferenceModel {

		if(ConferenceModel.mInstance == null) {

			ConferenceModel.mInstance = new ConferenceModel();
		}

		return ConferenceModel.mInstance;
	}
}
