import ComponentData from "../../../core/component/data/ComponentData";

export default class Conference extends ComponentData {

	private mConferenceId:number;
	private mTitle:string;
	private mDescription:string;
	private mSpeakerId:number;
	private mDate:Date;
	private mDay:number;
	private mHours:string;
	private mMinutes:string;
	private mTagCss:string;


	constructor() {
		super();
	}

	public get conferenceId():number { return this.mConferenceId; }
	public set conferenceId(aValue:number) { this.mConferenceId = aValue; }

	public get title():string { return this.mTitle; }
	public set title(aValue:string) { this.mTitle = aValue; }

	public get description():string { return this.mDescription; }
	public set description(aValue:string) { this.mDescription = aValue; }

	public get speakerId():number { return this.mSpeakerId; }
	public set speakerId(aValue:number) { this.mSpeakerId = aValue; }

	public get date():Date { return this.mDate; }
	public set date(aValue:Date) { this.mDate = aValue; }

	public get day():number { return this.mDay; }
	public get hours():string { return this.mHours; }
	public get minutes():string { return this.mMinutes; }

	public get tagCss():string { return this.mTagCss; }
	public set tagCss(aValue:string) { this.mTagCss = aValue; }

	public FromJSON(aData:any):void {

		this.mConferenceId = aData.conferenceId;
		this.mTitle = aData.title;
		this.mDescription = aData.description;
		this.mSpeakerId = aData.speaker_id;
		this.mTagCss = aData.tag_css;

		this.mDate = new Date(aData.date);

		this.mDate.setUTCHours(this.mDate.getUTCHours()+4);

		this.mDay = this.mDate.getDate();

		var hours:number = this.mDate.getHours()
		var minutes:number = this.mDate.getMinutes()

		this.mHours = (hours < 10) ? "0" + hours.toString() : hours.toString();
		this.mMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
	}

}
