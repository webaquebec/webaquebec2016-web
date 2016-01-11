import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Profile from "./data/Profile";

import EConfig from "../main/EConfig";

export default class ProfilesModel extends AbstractModel {

	private static mInstance:ProfilesModel;

	private mProfiles:Array<Profile>;

	private mDataLoaded:boolean = false;

	constructor() {

		super();

		this.mProfiles = [];
	}

	public IsLoaded():boolean { return this.mDataLoaded; }

	public FetchProfiles():void {

		this.Fetch(EConfig.BASE_URL + "speaker?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var profile:Profile = new Profile();
			profile.FromJSON(json[i]);
			this.mProfiles.push(profile);
		}

		this.mDataLoaded = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetProfileByID(aProfileID:number):Profile{

		for(var i:number = 0,  max = this.mProfiles.length; i < max; i++) {

			if(this.mProfiles[i].profileID == aProfileID){

				return this.mProfiles[i];
			}
		}

		return null;
	}

	public GetProfiles():Array<Profile> {

		return this.mProfiles;
	}

	public static GetInstance():ProfilesModel {

		if(ProfilesModel.mInstance == null) {

			ProfilesModel.mInstance = new ProfilesModel();
		}

		return ProfilesModel.mInstance;
	}
}
