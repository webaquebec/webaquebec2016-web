import ComponentData from "../../../core/component/data/ComponentData";

export default class TimeSlot extends ComponentData {

	private mTimeslotID:number;
	private mBegin:Date;
	private mEnd:Date;;

	private mMonth:number;
	private mDay:number;
	private mHours:string;
	private mMinutes:string;

	constructor() {
		super();
	}

	public get timeSlotID():number { return this.mTimeslotID; }
	public set timeSlotID(aValue:number) { this.mTimeslotID = aValue; }

	public get begin():Date { return this.mBegin; }
	public set begin(aValue:Date) { this.mBegin = aValue; }

	public get end():Date { return this.mEnd; }
	public set end(aValue:Date) { this.mEnd = aValue; }

	public get month():number { return this.mMonth; }
	public get day():number { return this.mDay; }
	public get hours():string { return this.mHours; }
	public get minutes():string { return this.mMinutes; }

	public FromJSON(aData:any):void {

		this.mTimeslotID = aData.id;

		this.mBegin = new Date(aData.waq_meta._conferencer_starts[0]*1000);
		this.mBegin.setUTCHours(this.mBegin.getUTCHours()+4);
		this.mEnd = new Date(aData.waq_meta._conferencer_ends[0]*1000);
		this.mEnd.setUTCHours(this.mEnd.getUTCHours()+4);

		this.mMonth = this.mBegin.getMonth();
		this.mDay = this.mBegin.getDate();

		var hours:number = this.mBegin.getHours()
		var minutes:number = this.mBegin.getMinutes()

		this.mHours = (hours < 10) ? "0" + hours.toString() : hours.toString();
		this.mMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
	}
}
