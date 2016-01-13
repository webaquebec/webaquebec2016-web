import ComponentData from "../../../core/component/data/ComponentData";

export default class Profile extends ComponentData {

	private mProfileID:number;
	private mParentId:number;

	private mFirstName:string;
	private mLastName:string;
	private mSubtitle:string;
	private mSlug:string;
	private mPhoto:string = "";
	private mThumbnail:string = "";
	private mBio:string;
	private mQuote:string;

	private mTwitter:string;
	private mFacebook:string;
	private mLinkedIn:string;

	//private mOrder:number;

	constructor() {
		super();
	}

	public get profileID():number { return this.mProfileID; }
	public set profileID(aValue:number) { this.mProfileID = aValue; }

	public get parentId():number { return this.mParentId; }
	public set parentId(aValue:number) { this.mParentId = aValue; }

	public get firstName():string { return this.mFirstName; }
	public set firstName(aValue:string) { this.mFirstName = aValue; }

	public get lastName():string { return this.mLastName; }
	public set lastName(aValue:string) { this.mLastName = aValue; }

	public get subtitle():string { return this.mSubtitle; }
	public set subtitle(aValue:string) { this.mSubtitle = aValue; }

	public get slug():string { return this.mSlug; }
	public set slug(aValue:string) { this.mSlug = aValue; }

	public get photo():string { return this.mPhoto; }
	public set photo(aValue:string) { this.mPhoto = aValue; }

	public get thumbnail():string { return this.mThumbnail; }
	public set thumbnail(aValue:string) { this.mThumbnail = aValue; }

	public get bio():string { return this.mBio; }
	public set bio(aValue:string) { this.mBio = aValue; }

	public get quote():string { return this.mQuote; }
	public set quote(aValue:string) { this.mQuote = aValue; }

	public get twitter():string { return this.mTwitter; }
	public set twitter(aValue:string) { this.mTwitter = aValue; }

	public get facebook():string { return this.mFacebook; }
	public set facebook(aValue:string) { this.mFacebook = aValue; }

	public get linkedIn():string { return this.mLinkedIn; }
	public set linkedIn(aValue:string) { this.mLinkedIn = aValue; }

	//public get order():number { return this.mOrder; }
	//public set order(aOrder:number) { this.mOrder = aOrder; }

	public FromJSON(aData:any):void {

		var div:HTMLElement = document.createElement("div")
		div.innerHTML = aData.title.rendered;
		var name = div.textContent.split(" ");

		this.mProfileID = aData.id;
		
		this.mSlug = aData.slug;

		this.mFirstName = name[0];
		this.mLastName = name.splice(1, name.length).join(" ");

		this.mBio = aData.content.rendered;
		this.mQuote = !aData.excerpt ? "" : aData.excerpt.rendered;

		this.mSubtitle = !aData.waq_meta._conferencer? "" : aData.waq_meta._conferencer_title[0];

		var customFields:any = aData.acf;

		this.mPhoto = !customFields.image_presentation ? "" : customFields.image_presentation.url;
		this.mThumbnail = !customFields.image_thumbnail ? "" : customFields.image_thumbnail.url;
		this.mTwitter = !customFields.twitter ? "" : customFields.twitter;
		this.mFacebook = !customFields.facebook ? "" : customFields.facebook;
		this.mLinkedIn = !customFields.linkedin ? "" : customFields.linkedin;
		//this.mOrder = aData.order;
	}

}
