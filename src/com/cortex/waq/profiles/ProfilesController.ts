import ComponentEvent from "../../core/component/event/ComponentEvent";
import ComponentBinding from "../../core/component/ComponentBinding";
import ListComponent from "../../core/component/ListComponent";

import EventDispatcher from "../../core/event/EventDispatcher";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import PageControllerHelper from "../helpers/PageControllerHelper"

import Profile from "./data/Profile"
import ProfilesModel from "./ProfilesModel";

import { Router } from "cortex-toolkit-js-router";

export default class ProfilesController extends EventDispatcher {

	private static QUOTE_INDEX_IN_GRID:number = 8;

	protected mProfilesControllerId:number;

	public mProfilesView:AbstractView;
	protected mListComponent:ListComponent;

	protected mProfilesModel:ProfilesModel;
	protected mProfiles:Array<Profile>;
	protected mTotalProfiles:number;

	protected mPageView:HTMLElement;
	protected mNoSelectionView:HTMLElement;
	protected mNoSelectionClass:string;
	protected mSelectionView:HTMLElement;
	protected mGridView:HTMLElement;

	protected mFullName:HTMLElement;
	protected mSubtitle:HTMLElement;
	protected mPhoto:HTMLElement;
	protected mBio:HTMLElement;
	protected mContact:HTMLElement;
	protected mSocialName:HTMLElement;
	protected mLink:HTMLElement;

	protected mQuote:string;
	protected mQuoteAuthor:string;
	protected mTitle:string;
	protected mBackButtonText:string;

	protected mScrollView:HTMLElement;
	protected mBackButton:HTMLElement;

	protected mTilePrefix:string;

	protected mSelectedTile:HTMLElement;

	protected mReady:boolean;

	constructor() {

		super();

		this.Init();
	}

	public GetThis():ProfilesController{
		return this;
	}

	public Init():void {

		this.mProfilesControllerId = PageControllerHelper.GetUniqueNumber();

		this.mTilePrefix = "profiles-tile-" + this.mProfilesControllerId + "-";

		this.mProfilesModel = ProfilesModel.GetInstance();
	}

	public Destroy():void {

		document.getElementById("content-current").removeChild(this.mPageView);

		this.mProfilesView.RemoveEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mProfilesView.Destroy();
		this.mProfilesView = null;

		this.mReady = false;
	}

	public IsReady():boolean{ return this.mReady; }

	protected OnTemplateLoaded(aEvent:MVCEvent):void {

		this.mProfilesView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});

		this.FindElements();

		this.mNoSelectionView.innerHTML = "<h1>" + this.mTitle + "</h1>";
		this.mNoSelectionView.classList.add(this.mNoSelectionClass);
		this.mBackButton.innerHTML = "<p>" + this.mBackButtonText + "</p>";

		this.mProfilesView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		this.mProfilesView.AddClickControl(this.mBackButton);
		this.mProfilesView.AddClickControl(this.mLink);

		this.mListComponent = new ListComponent();
		this.mListComponent.Init(this.mGridView.id);

		this.CreateProfileTiles(this.mProfiles);

		this.mReady = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
	}

	private FindElements():void {

		this.mPageView = PageControllerHelper.RenameAndReturnElement("profiles-view");
		this.mNoSelectionView = PageControllerHelper.RenameAndReturnElement("profiles-selection-none");
		this.mSelectionView = PageControllerHelper.RenameAndReturnElement("profiles-selection");
		this.mGridView = PageControllerHelper.RenameAndReturnElement("profiles-grid");

		this.mFullName = PageControllerHelper.RenameAndReturnElement("profiles-details-name");
		this.mSubtitle = PageControllerHelper.RenameAndReturnElement("profiles-details-title");
		this.mPhoto = PageControllerHelper.RenameAndReturnElement("profiles-selected-photo");
		this.mBio = PageControllerHelper.RenameAndReturnElement("profiles-selected-bio");
		this.mContact = PageControllerHelper.RenameAndReturnElement("profiles-selected-contact");
		this.mSocialName = PageControllerHelper.RenameAndReturnElement("profiles-details-socialName");

		this.mLink = PageControllerHelper.RenameAndReturnElement("profiles-selected-link");

		this.mScrollView = document.getElementById("profiles-selection-show");
		this.mBackButton = PageControllerHelper.RenameAndReturnElement("profiles-selected-return");
	}

	private CreateProfileTiles(aProfiles:Array<Profile>):void {

		this.mTotalProfiles = aProfiles.length;

		for (var i:number = 0; i < this.mTotalProfiles; i++) {

			var componentBinding:ComponentBinding;

			if (i == ProfilesController.QUOTE_INDEX_IN_GRID) {

				componentBinding = new ComponentBinding(new AbstractView(), <Profile>{});
				componentBinding.Template = "templates/profiles/profileQuote.html";
				this.mListComponent.AddComponent(componentBinding);
			}

			var profile:Profile = aProfiles[i];

			profile.parentId = this.mProfilesControllerId;

			componentBinding = new ComponentBinding(new AbstractView(), profile);
			componentBinding.Template = "templates/profiles/profileTile.html";
			this.mListComponent.AddComponent(componentBinding);
		}

		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this.OnAllItemsReady, this);
		this.mListComponent.LoadWithTemplate();
	}

	private OnAllItemsReady(aEvent:ComponentEvent):void {

		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.OnAllItemsReady, this);

		PageControllerHelper.RenameAndReturnElement("profiles-quoteText").innerHTML = this.mQuote;
		PageControllerHelper.RenameAndReturnElement("profiles-quoteAuthor").innerHTML = this.mQuoteAuthor;

		for (var i:number = 0; i < this.mTotalProfiles + 1; i++) {

			var tileElement:HTMLElement = document.getElementById(this.mTilePrefix + i.toString());

			if(tileElement == null) { continue; }

			this.mProfilesView.AddClickControl(tileElement);
		}
	}

	protected OnScreenClicked(aEvent:MouseTouchEvent):void {

		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id === this.mBackButton.id) {

			this.OnReturnClicked();

		}if (element.id === this.mLink.id) {

			Router.GetInstance().Navigate("!" + this.mLink.textContent);

		} else if (element.id.indexOf(this.mTilePrefix) >= 0) {

			var tileId:string = element.id.split(this.mTilePrefix)[1];

			var profile:Profile = <Profile>this.mListComponent.GetDataByID(tileId);

			Router.GetInstance().Navigate("!" + profile.slug);
		}
	}

	private OnReturnClicked() {

		this.mSelectionView.className = "profiles-selection profiles-split profiles-hidden";

		this.DeselectTile();
	}

	public ShowProfile(aProfile:Profile):void {

		this.SetProfileDetails(aProfile);

		/*this.DeselectTile();

		this.mSelectedTile = aElement;
		this.mSelectedTile.className = "profiles-tile profiles-tile-selected";*/

		document.getElementById("profiles-selected-details").scrollTop = 0;

		this.HideNoSelectionView();
		this.ShowSelectionView();
		this.ScrollDetailsView();
	}

	private DeselectTile():void {

		if (this.mSelectedTile != null) {

			this.mSelectedTile.className = "profiles-tile";
			this.mSelectedTile = null;
		}
	}

	protected SetProfileDetails(aProfile:Profile):void {

		this.mFullName.innerHTML = aProfile.firstName + " " + aProfile.lastName;

		if (aProfile.subtitle !== "") {

			this.mFullName.innerHTML += ", ";
			this.mSubtitle.innerHTML = aProfile.subtitle;
		}

		this.mPhoto.style.backgroundImage = "url(" + aProfile.photo + ")";

		this.mBio.innerHTML = aProfile.description;

		var hasSocialMedia:boolean = false;

		hasSocialMedia = this.DisplaySocialLink("profiles-social-twitter", aProfile.twitter) || hasSocialMedia;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-facebook", aProfile.facebook) || hasSocialMedia;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-linkedin", aProfile.linkedIn) || hasSocialMedia;

		if (hasSocialMedia) {

			this.mContact.style.height = "initial";
			this.mContact.style.opacity = "1";
			this.mSocialName.innerHTML = aProfile.firstName + " " + aProfile.lastName;

		} else {

			this.mContact.style.height = "0px";
			this.mContact.style.opacity = "0";
		}
	}

	private DisplaySocialLink(aElementId:string, aUrl:string):boolean {

		var element:HTMLLinkElement = <HTMLLinkElement>document.getElementById(aElementId);

		if (aUrl === "" || aUrl == null) {

			element.className = "hidden";

			return false;
		}

		element.className = "profiles-selected-social";
		element.href = aUrl;

		return true;
	}

	private HideNoSelectionView():void {
		this.mNoSelectionView.style.display = "none";
	}

	private ShowSelectionView():void {
		this.mSelectionView.className = "profiles-selection profiles-split profiles-shown";
	}

	private ScrollDetailsView():void {
		this.mScrollView.scrollTop = 0;
	}
}
