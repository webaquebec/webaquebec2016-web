import ComponentData from "../../../core/component/data/ComponentData";

export default class Conference extends ComponentData {

	private mConferenceId:number;
	private mTitle:string;
	private mDescription:string;
	private mSpeakerId:number;
	private mTagCss:string;

	constructor() {
		super();
	}

	public get conferenceId():number { return this.mConferenceId; }
	public set conferenceId(aConferenceId:number) { this.mConferenceId = aConferenceId; }

	public get title():string { return this.mTitle; }
	public set title(aTitle:string) { this.mTitle = aTitle; }

	public get description():string { return this.mDescription; }
	public set description(aDescription:string) { this.mDescription = aDescription; }

	public get speakerId():number { return this.mSpeakerId; }
	public set speakerId(aSpeakerId:number) { this.mSpeakerId = aSpeakerId; }

	public get tagCss():string { return this.mTagCss; }
	public set tagCss(aTagCss:string) { this.mTagCss = aTagCss; }

	public FromJSON(aData:any):void {
		this.mConferenceId = aData.conferenceId;
		this.mTitle = aData.title;
		this.mDescription = aData.description;
		this.mSpeakerId = aData.speaker_id;
		this.mTagCss = aData.tag_css;
	}

}
