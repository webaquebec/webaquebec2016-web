import ComponentData from "../../../core/component/data/ComponentData";

export default class PartnerLevel extends ComponentData {

	private mPartnerLevelID:number;
	private mTitle:string;

	constructor() {
		super();
	}

	public get partnerLevelID():number { return this.mPartnerLevelID; }
	public set partnerLevelID(aValue:number) { this.mPartnerLevelID = aValue; }

	public get title():number { return this.mTitle; }
	public set title(aValue:number) { this.mTitle = aValue; }


	public FromJSON(aData:any):void {

		this.mPartnerLevelID = aData.id;

		var div:HTMLElement = document.createElement("div")
		div.innerHTML = aData.title.rendered;
		this.mTitle = div.textContent;
	}
}
