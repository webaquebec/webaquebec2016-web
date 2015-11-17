import ComponentData from "../../../core/component/data/ComponentData";

import IDestroyable from "../../../core/garbage/IDestroyable";

export default class ExploreNode extends ComponentData implements IDestroyable {

	private mName:string;
	private mImage:string;
	private mOrder:number;
	private mLocations:Array<string>;

	constructor() {
		super();
	}

	public Destroy():void {}

	public get name():string { return this.mName; }
	public set name(aName:string) { this.mName = aName; }

	public get image():string { return this.mImage; }
	public set image(aImage:string) { this.mImage = aImage; }

	public get order():number { return this.mOrder; }
	public set order(aOrder:number) { this.mOrder = aOrder; }

	public get locations():number { return this.mOrder; }
	public set locations(aOrder:number) { this.mOrder = aOrder; }

	public FromJSON(aData:any):void {
		this.mName = aData.name;
		this.mImage = aData.image;
		this.mOrder = aData.order;
	}

}
