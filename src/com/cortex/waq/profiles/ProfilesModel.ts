import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import EProfileType from "./data/EProfileType"
import Profile from "./data/Profile";

import EConfig from "../main/EConfig";

export default class ProfilesModel extends AbstractModel {

	private static mInstanceSpeakers:ProfilesModel;
	private static mInstanceVolunteers:ProfilesModel;
	private static mInstancePartners:ProfilesModel;

	public static GetInstance(aDataSet:number):ProfilesModel {

		// Data set for speakers
		if (aDataSet === EProfileType.Speakers) {
			if (ProfilesModel.mInstanceSpeakers == null){
				ProfilesModel.mInstanceSpeakers = new ProfilesModel("profiles_speakers");
			}
			return ProfilesModel.mInstanceSpeakers;
		}

		if (aDataSet === EProfileType.Volunteers) {
			// Data set for volunteers
			if (ProfilesModel.mInstanceVolunteers == null){
				ProfilesModel.mInstanceVolunteers = new ProfilesModel("profiles_speakers");
			}
			return ProfilesModel.mInstanceVolunteers;
		}

		// Data set for partners
		if (ProfilesModel.mInstancePartners == null){
			ProfilesModel.mInstancePartners = new ProfilesModel("profiles_speakers");
		}
		return ProfilesModel.mInstancePartners;
	}

	private mResourcePath:string;
	private mProfiles:Array<Profile>;
	private mIsDataReady:boolean;

	constructor(aResourcePath) {

		super();

		this.mResourcePath = aResourcePath;
		this.mProfiles = [];
		this.mIsDataReady = false;
		this.CreateProfiles();
	}

	public get isDataReady():boolean { return this.mIsDataReady; }

	private CreateProfiles():void {

		this.Fetch("../json/waq/profiles_speakers.json");
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var profile:Profile = new Profile();
			profile.FromJSON(json[i]);
			this.mProfiles.push(profile);
		}

		this.mIsDataReady = true;
		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetProfiles():Array<Profile> {
		return this.mProfiles;
	}

}
