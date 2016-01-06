import ComponentData from "../../../core/component/data/ComponentData";

import Profile from "../../profiles/data/Profile";

export default class BlogPost extends ComponentData {

	private mTitle:string;
	private mProfile:Profile;
	private mProfileID:number;
	private mSlug:string;
	private mDescription:string;
	private mThumbnail:string;
	private mThumbnailID:number;
	private mDatePublished:string;
	private mText:string;
	private mReady:boolean;

	constructor() {

		super();

		this.mProfile = new Profile();
	}

	public get title():string { return this.mTitle; }
	public set title(aTitle:string) { this.mTitle = aTitle; }

	public get slug():string { return this.mSlug; }
	public set slug(aValue:string) { this.mSlug = aValue; }

	public get profileID():number { return this.mProfileID; }
	public set profileID(aValue:number) { this.mProfileID = aValue; }

	public get profile():Profile { return this.mProfile; }
	public set profile(aValue:Profile) { this.mProfile = aValue; }

	public get description():string { return this.mDescription; }
	public set description(aDescription:string) { this.mDescription = aDescription; }

	public get thumbnailID():number { return this.mThumbnailID; }
	public set thumbnailID(aValue:number) { this.mThumbnailID = aValue; }

	public get thumbnail():string { return this.mThumbnail; }
	public set thumbnail(aThumbnail:string) { this.mThumbnail = aThumbnail; }

	public get datePublished():string { return this.mDatePublished; }
	public set datePublished(aDatePublished:string) { this.mDatePublished = aDatePublished; }

	public get text():string { return this.mText; }
	public set text(aText:string) { this.mText = aText; }

	public get ready():boolean { return this.mReady; }
	public set ready(aValue:boolean) { this.mReady = aValue; }

	public FromJSON(aData:any):void {

		this.mTitle = aData.title.rendered;
		this.mSlug = aData.slug;
		this.mProfileID = aData.author;
		this.mDescription = aData.description;
		this.mThumbnailID = aData.featured_image;
		this.mDatePublished = aData.date;
		this.mText = aData.content.rendered;
	}

}
