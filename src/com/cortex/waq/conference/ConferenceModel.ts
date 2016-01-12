import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Conference from "./data/Conference";

import ProfilesModel from "../profiles/ProfilesModel";
import TimeSlotModel from "./TimeSlotModel";
import SubjectTypeModel from "./SubjectTypeModel";
import RoomModel from "./RoomModel";

import EConfig from "../main/EConfig";

export default class ConferenceModel extends AbstractModel {

	private static mInstance:ConferenceModel;

	private mConferences:Array<Conference>;

	private mProfilesModel:ProfilesModel;
	private mTimeSlotModel:TimeSlotModel;
	private mSubjectTypeModel:SubjectTypeModel;
	private mRoomModel:RoomModel;

	constructor() {

		super();

		this.mProfilesModel = ProfilesModel.GetInstance();
		this.mTimeSlotModel = TimeSlotModel.GetInstance();
		this.mSubjectTypeModel = SubjectTypeModel.GetInstance();
		this.mRoomModel = RoomModel.GetInstance();

		this.mConferences = [];
	}

	public FetchConferences():void {

		if (!this.mProfilesModel.IsSpeakerLoaded()){

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

			if(conference.speaker == null){
				alert(conference.title + " HAS NO SPEAKER!!! this will crash on live!");
				conference.speaker = this.mProfilesModel.GetSpeakers()[0];
			}

			if(conference.subjectType == null){
				alert(conference.title + " HAS NO SUBJECT TYPE!!! this will crash on live!");
				conference.subjectType = this.mSubjectTypeModel.GetSubjectTypes()[0];
			}
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

	public static GetInstance():ConferenceModel {

		if(ConferenceModel.mInstance == null) {

			ConferenceModel.mInstance = new ConferenceModel();
		}

		return ConferenceModel.mInstance;
	}
}
