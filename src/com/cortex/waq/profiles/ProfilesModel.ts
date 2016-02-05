import AbstractModel from "../../core/mvc/AbstractModel";

import Profile from "./data/Profile";
import Partner from "./data/Partner";
import ProfileEvent from "./event/ProfileEvent";

import { LazyLoader } from "cortex-toolkit-js-net";

import EConfig from "../main/EConfig";
import Spinner from "../spinner/Spinner";

export default class ProfilesModel extends AbstractModel {

	private static mInstance:ProfilesModel;

	private mSpeakers:Array<Profile>;
	private mVolunteers:Array<Profile>;
	private mPartners:Array<Partner>;

	private mSpeakersLoaded:boolean = false;
	private mVolunteersLoaded:boolean = false;
	private mPartnersLoaded:boolean = false;

	constructor() {

		super();

		this.mSpeakers = [];
		this.mVolunteers = [];
		this.mPartners = [];
	}

	public IsSpeakersLoaded():boolean { return this.mSpeakersLoaded; }
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

			var profile:Partner = new Partner();
			profile.FromJSON(json[i]);
			this.mPartners.push(profile);
		}

		this.mPartnersLoaded = true;

        Spinner.GetInstance().Hide();

		this.DispatchEvent(new ProfileEvent(ProfileEvent.PARTNERS_LOADED));
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

		this.DispatchEvent(new ProfileEvent(ProfileEvent.VOLUNTEERS_LOADED));
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

		this.DispatchEvent(new ProfileEvent(ProfileEvent.SPEAKERS_LOADED));
	}

	public GetProfiles():Array<Profile>{

		var profiles:Array<Profile> = this.GetSpeakers();
		profiles = profiles.concat(this.GetVolunteers());
		profiles = profiles.concat(this.GetPartners());
		return profiles;
	}

	public GetVolunteerByID(aProfileID:number):Profile{

		for(var i:number = 0,  max = this.mVolunteers.length; i < max; i++) {

			if(this.mVolunteers[i].profileID == aProfileID){

				return this.mVolunteers[i];
			}
		}

		return null;
	}

	public GetVolunteers():Array<Profile> { return this.mVolunteers.slice(0, this.mVolunteers.length); }

	public GetSpeakerByID(aProfileID:number):Profile{

		for(var i:number = 0,  max = this.mSpeakers.length; i < max; i++) {

			if(this.mSpeakers[i].profileID == aProfileID){

				return this.mSpeakers[i];
			}
		}

		return null;
	}

	public GetSpeakers():Array<Profile> { return this.mSpeakers.slice(0, this.mSpeakers.length); }

	public GetPartnerByID(aProfileID:number):Partner{

		for(var i:number = 0,  max = this.mPartners.length; i < max; i++) {

			if(this.mPartners[i].profileID == aProfileID){

				return this.mPartners[i];
			}
		}

		return null;
	}

	public GetPartners():Array<Profile> { return this.mPartners.slice(0, this.mPartners.length); }

	public static GetInstance():ProfilesModel {

		if(ProfilesModel.mInstance == null) {

			ProfilesModel.mInstance = new ProfilesModel();
		}

		return ProfilesModel.mInstance;
	}
}
