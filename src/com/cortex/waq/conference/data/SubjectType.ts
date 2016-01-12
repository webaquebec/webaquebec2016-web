import ComponentData from "../../../core/component/data/ComponentData";

export default class SubjectType extends ComponentData {

	private mSubjectTypeID:number;
	private mSubjectSlug:string;
	private mSubjectType:string;

	constructor() {
		super();
	}

	public get subjectTypeID():number { return this.mSubjectTypeID; }
	public set subjectTypeID(aValue:number) { this.mSubjectTypeID = aValue; }

	public get subjectType():string { return this.mSubjectType; }
	public set subjectType(aValue:string) { this.mSubjectType = aValue; }

	public get subjectSlug():string { return this.mSubjectSlug; }
	public set subjectSlug(aValue:string) { this.mSubjectSlug = aValue; }

	public FromJSON(aData:any):void {

		this.mSubjectTypeID = aData.id;
		this.mSubjectSlug = aData.slug;
		this.mSubjectType = aData.title.rendered;
	}
}
