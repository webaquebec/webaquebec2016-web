import ComponentData from "../../../core/component/data/ComponentData";

import EConferenceType from "../EConferenceType";

export default class SubjectType extends ComponentData {

	private mSubjectTypeID:number;
	private mSubjectType:string;
	private mTagCss:string;

	constructor() {
		super();
	}

	public get subjectTypeID():number { return this.mSubjectTypeID; }
	public set subjectTypeID(aValue:number) { this.mSubjectTypeID = aValue; }

	public get subjectType():string { return this.mSubjectType; }
	public set subjectType(aValue:string) { this.mSubjectType = aValue; }

	public get tagCss():string { return this.mTagCss; }
	public set tagCss(aValue:string) { this.mTagCss = aValue; }

	public FromJSON(aData:any):void {

		this.mSubjectTypeID = aData.id;
		this.mSubjectType = aData.title.rendered;

		this.mTagCss = EConferenceType.DESIGN;
	}
}
