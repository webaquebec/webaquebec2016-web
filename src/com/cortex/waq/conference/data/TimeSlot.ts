import ComponentData from "../../../core/component/data/ComponentData";

import DateHelper from "../../helpers/DateHelper";

export default class TimeSlot extends ComponentData {

	private mTimeslotID:number;
	private mBegin:Date;
	private mEnd:Date;;

	private mMonth:number;
	private mDay:number;
	private mHours:string;
	private mMinutes:string;
	private mFormatedDate:string;
	private mFormatedTime:string;

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

	public get formatedDate():string { return this.mFormatedDate; }
	public set formatedDate(aValue:string) { this.mFormatedDate = aValue; }
	public get formatedTime():string { return this.mFormatedTime; }
	public set formatedTime(aValue:string) { this.mFormatedTime = aValue; }

	public FromJSON(aData:any):void {

		this.mTimeslotID = aData.id;

        var userOffset:number = new Date(aData.waq_meta._conferencer_starts[0]*1000).getTimezoneOffset() * 60 * 1000;

		this.mBegin = new Date(aData.waq_meta._conferencer_starts[0]*1000 + userOffset);
		this.mEnd = new Date(aData.waq_meta._conferencer_ends[0]*1000 + userOffset);

		this.mMonth = this.mBegin.getMonth();
		this.mDay = this.mBegin.getDate();

		var hours:number = this.mBegin.getHours()
		var minutes:number = this.mBegin.getMinutes()

		this.mHours = (hours < 10) ? "0" + hours.toString() : hours.toString();
		this.mMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();

		this.formatedDate = DateHelper.DAYS_LABELS[this.begin.getDay()].toUpperCase() + " "
					+ this.day + " " + DateHelper.MONTHS_LABELS[this.month].toUpperCase();
		this.formatedTime = this.hours + ":" +this.minutes;
	}
}
