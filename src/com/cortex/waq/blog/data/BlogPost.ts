import ComponentData from "../../../core/component/data/ComponentData";

export default class BlogPost extends ComponentData {

	private mTitle:string;
	private mDescription:string;
	private mThumbnail:string;
	private mDatePublished:string;
	private mText:string;

	constructor() {
		super();
	}

	public get title():string { return this.mTitle; }
	public set title(aTitle:string) { this.mTitle = aTitle; }

	public get description():string { return this.mDescription; }
	public set description(aDescription:string) { this.mDescription = aDescription; }

	public get thumbnail():string { return this.mThumbnail; }
	public set thumbnail(aThumbnail:string) { this.mThumbnail = aThumbnail; }

	public get datePublished():string { return this.mDatePublished; }
	public set datePublished(aDatePublished:string) { this.mDatePublished = aDatePublished; }

	public get text():string { return this.mText; }
	public set text(aText:string) { this.mText = aText; }

	public FromJSON(aData:any):void {
		this.mTitle = aData.title;
		this.mDescription = aData.description;
		this.mThumbnail = aData.thumbnail;
		this.mDatePublished = aData.date_published;
		this.mText = aData.text;
	}

}
