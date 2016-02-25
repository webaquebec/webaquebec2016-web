import ComponentData from "../../../core/component/data/ComponentData";

export default class Profile extends ComponentData {

	private mProfileID:number;
	private mProfileType:string;
	private mParentId:number;
	private mCompanyID:number;

	private mFirstName:string;
	private mLastName:string;
	private mSubtitle:string;
	private mSlug:string;

	private mLinkSlug:string;

	private mPhoto:string = "";
	private mThumbnail:string = "";
	private mMediumPhoto:string = "";
	private mMediumThumbnail:string = "";
	private mDescription:string;

	private mTwitter:string;
	private mFacebook:string;
	private mLinkedIn:string;
	private mWebsite:string;

	private mOrder:number;

	constructor() {
		super();
	}

	public get profileID():number { return this.mProfileID; }
	public set profileID(aValue:number) { this.mProfileID = aValue; }

	public get profileType():string { return this.mProfileType; }

	public get parentId():number { return this.mParentId; }
	public set parentId(aValue:number) { this.mParentId = aValue; }

	public get companyID():number { return this.mCompanyID; }
	public set companyID(aValue:number) { this.mCompanyID = aValue; }

	public get firstName():string { return this.mFirstName; }
	public set firstName(aValue:string) { this.mFirstName = aValue; }

	public get lastName():string { return this.mLastName; }
	public set lastName(aValue:string) { this.mLastName = aValue; }

	public get subtitle():string { return this.mSubtitle; }
	public set subtitle(aValue:string) { this.mSubtitle = aValue; }

	public get slug():string { return this.mSlug; }
	public set slug(aValue:string) { this.mSlug = aValue; }

	public get linkSlug():string { return this.mLinkSlug; }
	public set linkSlug(aValue:string) { this.mLinkSlug = aValue; }

	public get photo():string { return this.mPhoto; }
	public set photo(aValue:string) { this.mPhoto = aValue; }

	public get thumbnail():string { return this.mThumbnail; }
	public set thumbnail(aValue:string) { this.mThumbnail = aValue; }

	public get description():string { return this.mDescription; }
	public set description(aValue:string) { this.mDescription = aValue; }

	public get twitter():string { return this.mTwitter; }
	public set twitter(aValue:string) { this.mTwitter = aValue; }

	public get facebook():string { return this.mFacebook; }
	public set facebook(aValue:string) { this.mFacebook = aValue; }

	public get linkedIn():string { return this.mLinkedIn; }
	public set linkedIn(aValue:string) { this.mLinkedIn = aValue; }

	public get website():string { return this.mWebsite; }
	public set website(aValue:string) { this.mWebsite = aValue; }

	public get order():number { return this.mOrder; }
	public set order(aOrder:number) { this.mOrder = aOrder; }

	public TileThumbnail():string {
		if(this.mProfileType === "sponsor") {
			return this.mMediumThumbnail;
		} else {
			return this.mThumbnail;
		}
	}
	public Photo():string {
		if(this.mProfileType === "sponsor") {
			return this.mMediumPhoto;
		} else {
			return this.mPhoto;
		}
	}

	public FromJSON(aData:any):void {

		var div:HTMLElement = document.createElement("div");
		div.innerHTML = aData.title.rendered;
		var name = div.textContent.split(" ");

		this.mProfileID = aData.id;

		this.mSlug = aData.slug;
		this.mProfileType = aData.type;

		this.mFirstName = name[0];
		this.mLastName = name.splice(1, name.length).join(" ");

		this.mDescription = !aData.waq_meta.description ? aData.content.rendered : aData.waq_meta.description;
		// TODO split into Speaker Class (ie: Partner)
		this.mSubtitle = !aData.waq_meta._conferencer_title ? "" : aData.waq_meta._conferencer_title[0];
		// TODO split into Volunteer Class (ie: Partner)
		this.mSubtitle = !aData.waq_meta.committee? this.mSubtitle : aData.waq_meta.committee[0];

		this.mCompanyID = !aData.waq_meta._conferencer_company ? "" : aData.waq_meta._conferencer_company[0];

		var customFields:any = aData.acf;

		this.mPhoto = !customFields.image_presentation ? "" : customFields.image_presentation.url;
		this.mMediumPhoto = !customFields.image_presentation ? "" : customFields.image_presentation.sizes.large;
		this.mThumbnail = !customFields.image_thumbnail ? "" : customFields.image_thumbnail.url;
		this.mMediumThumbnail = !customFields.image_thumbnail ? "" : customFields.image_thumbnail.sizes.medium;
		this.mTwitter = !customFields.twitter ? "" : "https://twitter.com/" + customFields.twitter;
		this.mFacebook = !customFields.facebook ? "" : customFields.facebook;
		this.mLinkedIn = !customFields.linkedin ? "" : customFields.linkedin;
		this.mWebsite = !customFields.site_web ? "" : customFields.site_web;
		this.mOrder = !aData.waq_meta._conferencer_order ? 0 : Number(aData.waq_meta._conferencer_order[0]);
	}

}
