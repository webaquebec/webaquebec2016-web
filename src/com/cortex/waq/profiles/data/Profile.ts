import ComponentData from "../../../core/component/data/ComponentData";

export default class Profile extends ComponentData {

	private mParentId:number;

	private mFirstName:string;
	private mLastName:string;
	private mSubtitle:string;
	private mPhoto:string;
	private mBio:string;

	private mTwitter:string;
	private mFacebook:string;
	private mLinkedIn:string;

	//private mOrder:number;

	constructor() {
		super();
	}

	public get parentId():number { return this.mParentId; }
	public set parentId(aParentId:number) { this.mParentId = aParentId; }

	public get firstName():string { return this.mFirstName; }
	public set firstName(aFirstName:string) { this.mFirstName = aFirstName; }

	public get lastName():string { return this.mLastName; }
	public set lastName(aLastName:string) { this.mLastName = aLastName; }

	public get subtitle():string { return this.mSubtitle; }
	public set subtitle(aSubtitle:string) { this.mSubtitle = aSubtitle; }

	public get photo():string { return this.mPhoto; }
	public set photo(aPhoto:string) { this.mPhoto = aPhoto; }

	public get bio():string { return this.mBio; }
	public set bio(aBio:string) { this.mBio = aBio; }

	public get twitter():string { return this.mTwitter; }
	public set twitter(aTwitter:string) { this.mTwitter = aTwitter; }

	public get facebook():string { return this.mFacebook; }
	public set facebook(aFacebook:string) { this.mFacebook = aFacebook; }

	public get linkedIn():string { return this.mLinkedIn; }
	public set linkedIn(aLinkedIn:string) { this.mLinkedIn = aLinkedIn; }

	//public get order():number { return this.mOrder; }
	//public set order(aOrder:number) { this.mOrder = aOrder; }

	public FromJSON(aData:any):void {
		this.mFirstName = aData.firstName;
		this.mLastName = aData.lastName;
		this.mSubtitle = aData.subtitle;
		this.mPhoto = aData.photo;
		this.mBio = aData.bio;

		this.mTwitter = aData.twitter;
		this.mFacebook = aData.facebook;
		this.mLinkedIn = aData.linkedin;

		//this.mOrder = aData.order;
	}

}
