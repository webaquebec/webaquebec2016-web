import AbstractModel from "../../core/mvc/AbstractModel";
import MVCEvent from "../../core/mvc/event/MVCEvent";

import PartnerLevel from "./data/PartnerLevel";

import EConfig from "../main/EConfig";
import Spinner from "../spinner/Spinner";

export default class PartnerLevelModel extends AbstractModel {

	private static mInstance:PartnerLevelModel;

	private mPartnerLevels:Array<PartnerLevel>;

	private mIsLoaded:boolean = false;

	constructor() {

		super();

		this.mPartnerLevels = [];
	}

	public IsLoaded():boolean { return this.mIsLoaded; }

	public FetchPartnerLevels():void {

        Spinner.GetInstance().Show();

		this.Fetch(EConfig.BASE_URL + "sponsor_level?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var partnerLevel:PartnerLevel = new PartnerLevel();
			partnerLevel.FromJSON(json[i]);
			this.mPartnerLevels.push(partnerLevel);
		}

		this.mIsLoaded = true;

        Spinner.GetInstance().Hide();

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetPartnerLevels():Array<PartnerLevel>{

		return this.mPartnerLevels.slice(0, this.mPartnerLevels.length);
	}

	public GetPartnerLevelByID(aPartnerLevelID:number):PartnerLevel{

		for(var i:number = 0,  max = this.mPartnerLevels.length; i < max; i++) {

			if(this.mPartnerLevels[i].partnerLevelID == aPartnerLevelID){

				return this.mPartnerLevels[i];
			}
		}

		return null;
	}

	public static GetInstance():PartnerLevelModel {

		if(PartnerLevelModel.mInstance == null) {

			PartnerLevelModel.mInstance = new PartnerLevelModel();
		}

		return PartnerLevelModel.mInstance;
	}
}
