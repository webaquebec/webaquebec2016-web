import ComponentData from "../../../core/component/data/ComponentData";

export default class Place extends ComponentData {

	private mPlaceID:number;
	private mDistance:number;
	private mType:string;
	private mName:string;
	private mPrice:number;
	private mHours:string;

	constructor() {
		super();
	}

	public get placeID():number { return this.mPlaceID; }
	public set placeID(aValue:number) { this.mPlaceID = aValue; }

	public get distance():number { return this.mDistance; }
	public set distance(aValue:number) { this.mDistance = aValue; }

	public get name():string { return this.mName; }
	public set name(aValue:string) { this.mName = aValue; }

	public get type():string { return this.mType; }
	public set type(aValue:string) { this.mType = aValue; }

	public get price():number { return this.mPrice; }
	public set price(aPrice:number) { this.mPrice = aPrice; }

	public get hours():string { return this.mHours; }
	public set hours(aHours:string) { this.mHours = aHours; }

	public FromJSON(aData:any):void {

		this.mPlaceID = aData.id;

		var div:HTMLElement = document.createElement("div")
		div.innerHTML = aData.title.rendered;
		this.mName = div.textContent;

		this.mType = aData.acf.type;
		this.mDistance = aData.distance;
		this.mPrice = aData.price;
		this.mHours = aData.hours;
	}

}
