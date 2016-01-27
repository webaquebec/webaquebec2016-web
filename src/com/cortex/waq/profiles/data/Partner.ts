import Profile from "./Profile";

export default class Partner extends Profile {

	private mPartnerLevelID:number;
	private mPartnerLevel:string;

	constructor() {
		super();
	}

	public get partnerLevelID():number { return this.mPartnerLevelID; }
	public set partnerLevelID(aValue:number) { this.mPartnerLevelID = aValue; }

	public get partnerLevel():string { return this.mPartnerLevel; }

	public FromJSON(aData:any):void {

		super.FromJSON(aData);

		this.mPartnerLevelID = aData.waq_meta._conferencer_level[0];
	}
}
