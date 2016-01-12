import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Profile from "./data/Profile";

import { LazyLoader } from "cortex-toolkit-js-net";

import EConfig from "../main/EConfig";
import Spinner from "../spinner/Spinner";

export default class ProfilesModel extends AbstractModel {

	private static mInstance:ProfilesModel;

	private mSpeakers:Array<Profile>;
	private mVolunteers:Array<Profile>;
	private mPartners:Array<Profile>;

	private mSpeakersLoaded:boolean = false;
	private mVolunteersLoaded:boolean = false;
	private mPartnersLoaded:boolean = false;

	constructor() {

		super();

		this.mSpeakers = [];
		this.mVolunteers = [];
		this.mPartners = [];
	}

	public IsSpeakerLoaded():boolean { return this.mSpeakersLoaded; }
	public IsVolunteersLoaded():boolean { return this.mVolunteersLoaded; }
	public IsPartnersLoaded():boolean { return this.mPartnersLoaded; }

	public FetchSpeakers():void {
        Spinner.GetInstance().Show();
		this.Fetch(EConfig.BASE_URL + "speaker?per_page=" + EConfig.PER_PAGE);
	}

	public FetchVolunteers():void {
        Spinner.GetInstance().Show();
		var promise = LazyLoader.loadJSON(EConfig.BASE_URL + "benevole?per_page=" + EConfig.PER_PAGE);
		promise.then((results) => { this.OnVolunteersURLLoaded(results); });
	}

	public FetchPartners():void {
        Spinner.GetInstance().Show();
		var promise = LazyLoader.loadJSON(EConfig.BASE_URL + "sponsor?per_page=" + EConfig.PER_PAGE);
		promise.then((results) => { this.OnPartnersURLLoaded(results); });
	}

	private OnPartnersURLLoaded(aJSONData:any):void{

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var profile:Profile = new Profile();
			profile.FromJSON(json[i]);
			this.mPartners.push(profile);
		}

		this.mPartnersLoaded = true;

        Spinner.GetInstance().Hide();
		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	private OnVolunteersURLLoaded(aJSONData:any):void{

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var profile:Profile = new Profile();
			profile.FromJSON(json[i]);
			this.mVolunteers.push(profile);
		}

		this.mVolunteersLoaded = true;

        Spinner.GetInstance().Hide();
		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var profile:Profile = new Profile();
			profile.FromJSON(json[i]);
			this.mSpeakers.push(profile);
		}

		this.mSpeakersLoaded = true;

        Spinner.GetInstance().Hide();
		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetVolunteerByID(aProfileID:number):Profile{

		for(var i:number = 0,  max = this.mVolunteers.length; i < max; i++) {

			if(this.mVolunteers[i].profileID == aProfileID){

				return this.mVolunteers[i];
			}
		}

		return null;
	}

	public GetVolunteers():Array<Profile> { return this.mVolunteers; }

	public GetSpeakerByID(aProfileID:number):Profile{

		for(var i:number = 0,  max = this.mSpeakers.length; i < max; i++) {

			if(this.mSpeakers[i].profileID == aProfileID){

				return this.mSpeakers[i];
			}
		}

		return null;
	}

	public GetSpeakers():Array<Profile> { return this.mSpeakers; }

	public GetPartnerByID(aProfileID:number):Profile{

		for(var i:number = 0,  max = this.mPartners.length; i < max; i++) {

			if(this.mPartners[i].profileID == aProfileID){

				return this.mPartners[i];
			}
		}

		return null;
	}

	public GetPartners():Array<Profile> { return this.mPartners; }

	public static GetInstance():ProfilesModel {

		if(ProfilesModel.mInstance == null) {

			ProfilesModel.mInstance = new ProfilesModel();
		}

		return ProfilesModel.mInstance;
	}
}
