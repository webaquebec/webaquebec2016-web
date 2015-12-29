import ComponentData from "../../../core/component/data/ComponentData";

export default class ExploreNode extends ComponentData {

	private mDistance:number;
	private mName:string;
	private mPrice:number;
	private mHours:string;

	constructor() {
		super();
	}

	public get distance():number { return this.mDistance; }
	public set distance(aDistance:number) { this.mDistance = aDistance; }

	public get name():string { return this.mName; }
	public set name(aName:string) { this.mName = aName; }

	public get price():number { return this.mPrice; }
	public set price(aPrice:number) { this.mPrice = aPrice; }

	public get hours():string { return this.mHours; }
	public set hours(aHours:string) { this.mHours = aHours; }

	public FromJSON(aData:any):void {

		this.mDistance = aData.distance;
		this.mName = aData.name;
		this.mPrice = aData.price;
		this.mHours = aData.hours;
	}

}
