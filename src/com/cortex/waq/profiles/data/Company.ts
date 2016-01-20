import ComponentData from "../../../core/component/data/ComponentData";

export default class Company extends ComponentData {

	private mCompanyID:number;
	private mTitle:string;

	constructor() {
		super();
	}

	public get companyID():number { return this.mCompanyID; }
	public set companyID(aValue:number) { this.mCompanyID = aValue; }

	public get title():string { return this.mTitle; }
	public set title(aValue:string) { this.mTitle = aValue; }


	public FromJSON(aData:any):void {
		
		this.mCompanyID = aData.id;
		this.mTitle =  aData.title.rendered;
	}

}
