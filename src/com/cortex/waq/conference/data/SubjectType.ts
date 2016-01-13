import ComponentData from "../../../core/component/data/ComponentData";

export default class SubjectType extends ComponentData {

	private mSubjectTypeID:number;
	private mSubjectSlug:string;
	private mName:string;

	constructor() {
		super();
	}

	public get subjectTypeID():number { return this.mSubjectTypeID; }
	public set subjectTypeID(aValue:number) { this.mSubjectTypeID = aValue; }

	public get name():string { return this.mName; }
	public set name(aValue:string) { this.mName = aValue; }

	public get subjectSlug():string { return this.mSubjectSlug; }
	public set subjectSlug(aValue:string) { this.mSubjectSlug = aValue; }

	public FromJSON(aData:any):void {

		this.mSubjectTypeID = aData.id;
		this.mSubjectSlug = aData.slug;
		this.mName = aData.title.rendered;
	}
}
