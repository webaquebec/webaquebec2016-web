import ComponentData from "../../../core/component/data/ComponentData";

export default class Room extends ComponentData {

	private mRoomID:number;
	private mName:string;

	constructor() {
		super();
	}

	public get roomID():number { return this.mRoomID; }
	public set roomID(aValue:number) { this.mRoomID = aValue; }

	public get name():string { return this.mName; }
	public set name(aValue:string) { this.mName = aValue; }

	public FromJSON(aData:any):void {

		this.mRoomID = aData.id;
		this.mName = aData.title.rendered;
	}
}
