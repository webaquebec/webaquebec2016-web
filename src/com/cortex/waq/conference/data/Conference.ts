import ComponentData from "../../../core/component/data/ComponentData";

import IDestroyable from "../../../core/garbage/IDestroyable";

export default class Conference extends ComponentData implements IDestroyable {
	
	private mConferenceId:number;
	private mTitle:string;
	private mDescription:string;
	private mSpeakerId:number;
	
	constructor() {
		super();
	}
	
	public Destroy():void {}
	
	public get conferenceId():number { return this.mConferenceId; }
	public set conferenceId(aConferenceId:number) { this.mConferenceId = aConferenceId; }
	
	public get title():string { return this.mTitle; }
	public set title(aTitle:string) { this.mTitle = aTitle; }
	
	public get description():string { return this.mDescription; }
	public set description(aDescription:string) { this.mDescription = aDescription; }
	
	public get speakerId():number { return this.mSpeakerId; }
	public set speakerId(aSpeakerId:number) { this.mSpeakerId = aSpeakerId; }
	
	public FromJSON(aData:any):void {
		this.mConferenceId = aData.conferenceId;
		this.mTitle = aData.title;
		this.mDescription = aData.description;
		this.mSpeakerId = aData.speakerId;
	}
	
}