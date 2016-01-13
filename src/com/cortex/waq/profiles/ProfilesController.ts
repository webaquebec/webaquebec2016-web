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

import EConfig from "../main/EConfig";

import { Router } from "cortex-toolkit-js-router";

export default class ProfilesController extends EventDispatcher {

	private static QUOTE_INDEX_IN_GRID:number = 8;

	private mProfilesControllerId:number;

	private mProfilesView:AbstractView;
	private mListComponent:ListComponent;

	private mProfilesModel:ProfilesModel;
	private mTotalProfiles:number;

	private mPageView:HTMLElement;
	private mNoSelectionView:HTMLElement;
	private mSelectionView:HTMLElement;
	private mGridView:HTMLElement;

	private mFullName:HTMLElement;
	private mSubtitle:HTMLElement;
	private mPhoto:HTMLElement;
	private mBio:HTMLElement;
	private mContact:HTMLElement;
	private mFirstName:HTMLElement;

    private mTitle:string;

	private mScrollView:HTMLElement;
	private mBackButton:HTMLElement;

	private mTilePrefix:string;

	private mSelectedTile:HTMLElement;

	private mReady:boolean;

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mProfilesControllerId = PageControllerHelper.GetUniqueNumber();

		this.mTilePrefix = "profiles-tile-" + this.mProfilesControllerId + "-";

		this.mProfilesModel = ProfilesModel.GetInstance();

		if (EConfig.CURRENT_PATH == "benevoles") {

			this.LoadVolunteers();

		} else if(EConfig.CURRENT_PATH == "conferenciers") {

			this.LoadSpeakers();

		} else if(EConfig.CURRENT_PATH == "partenaires") {

			this.LoadPartners();
		}
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

	private LoadPartners():void{

        this.mTitle = "Découvrez nos précieux partenaires qui contribuent au succès de l'évènement.";
		if(this.mProfilesModel.IsPartnersLoaded()) {

			this.OnDataReady(null);

		} else {

			this.mProfilesModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnDataReady, this);
			this.mProfilesModel.FetchPartners();
		}
	}

	private LoadVolunteers():void{

        this.mTitle = "Découvrez qui sont les bénévoles qui font du WAQ une vraie réussite.";
		if(this.mProfilesModel.IsVolunteersLoaded()) {

			this.OnDataReady(null);

		} else {

			this.mProfilesModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnDataReady, this);
			this.mProfilesModel.FetchVolunteers();
		}
	}

	private LoadSpeakers():void{

        this.mTitle = "Découvrez les conférenciers de l'édition 2016.";

		if(this.mProfilesModel.IsSpeakersLoaded()) {

			this.OnDataReady(null);

		}else{

			this.mProfilesModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnDataReady, this);
			this.mProfilesModel.FetchSpeakers();
		}
	}

	private OnDataReady(aEvent:MVCEvent) {

		this.mProfilesModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnDataReady, this);

		this.mProfilesView = new AbstractView();

		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");

		this.mListComponent = new ListComponent();
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});

		this.mProfilesView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		this.FindElements();

        this.mNoSelectionView.innerHTML = "<h1>" + this.mTitle + "</h1>";

		this.mProfilesView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		this.mProfilesView.AddClickControl(this.mBackButton);

		this.mListComponent.Init(this.mGridView.id);

		this.CreateProfileTiles();

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
		this.mFirstName = PageControllerHelper.RenameAndReturnElement("profiles-details-firstName");

		this.mScrollView = document.getElementById("profiles-selection-show");
		this.mBackButton = PageControllerHelper.RenameAndReturnElement("profiles-selected-return");
	}

	private GetProfiles():Array<Profile>{

		if(EConfig.CURRENT_PATH == "benevoles"){

			return this.mProfilesModel.GetVolunteers();

		}else if(EConfig.CURRENT_PATH == "conferenciers"){

			return this.mProfilesModel.GetSpeakers();

		}else if(EConfig.CURRENT_PATH == "partenaires"){

			return this.mProfilesModel.GetPartners();
		}

		return null;
	}

	private CreateProfileTiles():void {

		var profiles:Array<Profile> = this.GetProfiles();

		this.mTotalProfiles = profiles.length;

		for (var i:number = 0; i < this.mTotalProfiles; i++) {

			var componentBinding:ComponentBinding;

			if (i == ProfilesController.QUOTE_INDEX_IN_GRID) {

				componentBinding = new ComponentBinding(new AbstractView(), profiles[Math.floor(Math.random() * this.mTotalProfiles)]);
				componentBinding.Template = "templates/profiles/profileQuote.html";
				this.mListComponent.AddComponent(componentBinding);
			}

			var profile:Profile = profiles[i];

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

		for (var i:number = 0; i < this.mTotalProfiles + 1; i++) {

			if (i == ProfilesController.QUOTE_INDEX_IN_GRID) { continue };

			var tileElement:HTMLElement = document.getElementById(this.mTilePrefix + i.toString());

			if(tileElement == null) { continue; }

			this.mProfilesView.AddClickControl(tileElement);
		}
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {

		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id === this.mBackButton.id) {

			this.OnReturnClicked();

		} else if (element.id.indexOf(this.mTilePrefix) >= 0) {

			var tileId:string = element.id.split(this.mTilePrefix)[1];

			var profile:Profile = <Profile>this.mListComponent.GetDataByID(tileId);

			Router.GetInstance().Navigate(profile.slug);
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

	private SetProfileDetails(aProfile:Profile):void {

		this.mFullName.innerHTML = aProfile.firstName + " " + aProfile.lastName;

		if (aProfile.subtitle !== "") {

			this.mFullName.innerHTML += ", ";
			this.mSubtitle.innerHTML = aProfile.subtitle;
		}

		this.mPhoto.style.backgroundImage = "url(" + aProfile.photo + ")";
		//this.mPhoto.style.backgroundImage = "url(img/profiles/photo-" + aProfile.photo + ".jpg)";

		this.mBio.innerHTML = aProfile.bio;

		var hasSocialMedia:boolean = false;

		hasSocialMedia = this.DisplaySocialLink("profiles-social-twitter", aProfile.twitter) || hasSocialMedia;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-facebook", aProfile.facebook) || hasSocialMedia;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-linkedin", aProfile.linkedIn) || hasSocialMedia;

		if (hasSocialMedia) {

			this.mContact.style.height = "initial";
			this.mContact.style.opacity = "1";
			this.mFirstName.innerHTML = aProfile.firstName;

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
