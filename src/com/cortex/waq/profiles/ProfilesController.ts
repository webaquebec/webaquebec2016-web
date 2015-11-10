import ComponentData from "../../core/component/data/ComponentData";
import ComponentEvent from "../../core/component/event/ComponentEvent";
import ListComponent from "../../core/component/ListComponent";

import EventDispatcher from "../../core/event/EventDispatcher";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import PageControllerHelper from "../helpers/PageControllerHelper"

import EProfileType from "./data/EProfileType"
import Profile from "./data/Profile"
import ProfilesModel from "./ProfilesModel";

export default class ProfilesController extends EventDispatcher {

	private static QUOTE_INDEX_IN_GRID:number = 8;

	private mProfilesView:AbstractView;
	private mIdPageView:string;
	private mListComponent:ListComponent;

	private mProfilesModel:ProfilesModel;
	private mTotalProfiles:number;

	private mElFullName:HTMLElement;
	private mElSubtitle:HTMLElement;
	private mElPhoto:HTMLElement;
	private mElBio:HTMLElement;
	private mElContact:HTMLElement;
	private mElFirstName:HTMLElement;

	private mSelectedTile:HTMLElement;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mProfilesModel = ProfilesModel.GetInstance(EProfileType.Speakers);
		this.mProfilesModel.isDataReady ?
			this.OnDataReady() :
			this.mProfilesModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnJSONParsed, this);
	}

	public Destroy():void {
		var profilesHTMLElement:HTMLElement = document.getElementById("profiles-view");
		document.getElementById("content-current").removeChild(profilesHTMLElement);

		this.mProfilesView.RemoveEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mProfilesView.Destroy();
		this.mProfilesView = null;
	}

	private OnJSONParsed() {
		this.mProfilesModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONParsed, this);
		this.OnDataReady();
	}

	private OnDataReady() {
		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
		this.mListComponent = new ListComponent();
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});
		this.mProfilesView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
		this.FindElements();

		this.mProfilesView.AddClickControl(document.getElementById("profiles-selected-return"));

		this.mListComponent.Init("profiles-grid");
		this.CreateProfileTiles();
	}

	private FindElements():void {
		this.mElFullName = document.getElementById("profiles-details-name");
		this.mElSubtitle = document.getElementById("profiles-details-title");
		this.mElPhoto = document.getElementById("profiles-selected-photo");
		this.mElBio = document.getElementById("profiles-selected-bio");
		this.mElContact = document.getElementById("profiles-selected-contact");
		this.mElFirstName = document.getElementById("profiles-details-firstName");
	}

	private CreateProfileTiles():void {
		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);

		var profiles = this.mProfilesModel.GetProfiles();
		this.mTotalProfiles = profiles.length;
		for (var i:number = 0, iMax:number = this.mTotalProfiles; i < iMax; i++) {
			if (i == ProfilesController.QUOTE_INDEX_IN_GRID) {
				this.mListComponent.AddComponent(new AbstractView(), "templates/profiles/profileQuote.html", new ComponentData());
			}
			this.mListComponent.AddComponent(new AbstractView(), "templates/profiles/profileTile.html", profiles[i]);
		}
	}

	private AllItemsReady():void {
		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		for (var i:number = 0, iMax:number = this.mTotalProfiles + 1; i < iMax; i++) {
			if (i == ProfilesController.QUOTE_INDEX_IN_GRID) continue;
			this.mProfilesView.AddClickControl(document.getElementById("profiles-tile-" + i.toString()));
		}
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id == "profiles-selected-return") {
			this.OnReturnClicked();
		}
		else if (element.id.indexOf("profiles-tile-") >= 0) {
			this.OnTileClicked(element);
		}
	}

	private OnReturnClicked() {
		document.getElementById("profiles-selection").className = "profiles-split profiles-hidden";
		this.DeselectTile();
	}

	private OnTileClicked(aElement:HTMLElement):void {
		var tileId:string = aElement.id.split("profiles-tile-")[1];
		var profile:Profile = <Profile>this.mListComponent.GetDataByID(tileId);
		this.SetProfileDetails(profile);

		this.DeselectTile();
		this.mSelectedTile = aElement;
		aElement.className = "profiles-tile profiles-tile-selected";

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
		this.mElFullName.innerHTML = aProfile.firstName + " " + aProfile.lastName;
		if (aProfile.subtitle !== "") {
			this.mElFullName.innerHTML += ", ";
			this.mElSubtitle.innerHTML = aProfile.subtitle;
		}

		this.mElPhoto.style.backgroundImage = "url(img/profiles/photo-" + aProfile.photo + ".jpg)";
		this.mElBio.innerHTML = aProfile.bio;

		var hasSocialMedia:boolean = false;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-twitter", aProfile.twitter) || hasSocialMedia;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-facebook", aProfile.facebook) || hasSocialMedia;
		hasSocialMedia = this.DisplaySocialLink("profiles-social-linkedin", aProfile.linkedIn) || hasSocialMedia;

		if (hasSocialMedia) {
			this.mElContact.style.height = "initial";
			this.mElContact.style.opacity = "1";
			this.mElFirstName.innerHTML = aProfile.firstName;
		}
		else {
			this.mElContact.style.height = "0px";
			this.mElContact.style.opacity = "0";
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
		document.getElementById("profiles-selection-none").style.display = "none";
	}

	private ShowSelectionView():void {
		document.getElementById("profiles-selection").className = "profiles-split profiles-shown";
	}

	private ScrollDetailsView():void {
		var scrollView:HTMLElement = document.getElementById("profiles-selection-show");
		scrollView.scrollTop = 0;
	}
}
