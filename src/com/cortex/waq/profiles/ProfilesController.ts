import ComponentData from "../../core/component/data/ComponentData";
import ComponentEvent from "../../core/component/event/ComponentEvent";
import ListComponent from "../../core/component/ListComponent";

import EventDispatcher from "../../core/event/EventDispatcher";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import Profile from "./data/Profile"

export default class ProfilesController extends EventDispatcher {

	private mProfilesView:AbstractView;
	private mListComponent:ListComponent;

	private mProfiles:Array<Profile>;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");

		this.mListComponent = new ListComponent();

		this.mProfiles = [];
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("profiles-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mProfilesView.RemoveEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mProfilesView.Destroy();
		this.mProfilesView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});
		this.mProfilesView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		this.mProfilesView.AddClickControl(document.getElementById("profiles-selected-return"));

		this.mListComponent.Init("profiles-grid");
		this.CreateProfileTiles();
	}

	private CreateProfileTiles():void {
		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);

		for (var i:number = 0, iMax:number = 26; i < iMax; i++) {
			if (i == 8) {
				this.mListComponent.AddComponent(new AbstractView(), "templates/profiles/profileQuote.html", new ComponentData());
			}
			var n:number = Math.ceil(Math.random() * 8);
			var p:Profile = new Profile();
			p.photo = "p" + n + ".png";
			this.mListComponent.AddComponent(new AbstractView(), "templates/profiles/profileTile.html", p);
		}
	}

	private AllItemsReady():void {
		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		for (var i:number = 0, max:number = 26; i < max; i++) {
			if (i == 8) continue;
			this.mProfilesView.AddClickControl(document.getElementById("profiles-tile-" + i.toString()));
		}
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		console.log(element.id);

		if (element.id == "profiles-selected-return") {
			this.OnReturnClicked();
		}
		else if (element.id.indexOf("profiles-tile-") >= 0) {
			this.OnTileClicked(element.id);
		}
	}

	private OnReturnClicked() {
		var selectionView:HTMLElement = document.getElementById("profiles-selection");
		selectionView.style.left = "100%";
	}

	private OnTileClicked(aElementId:string):void {
		var selectionView:HTMLElement = document.getElementById("profiles-selection");
		selectionView.style.left = "0";
		selectionView.style.display = "block";

		var scrollView:HTMLElement = document.getElementById("profiles-selection-show");
		scrollView.scrollTop = 0;

		document.getElementById("profiles-selection-none").style.display = "none";
		//selectionView.className = "profiles-split profiles-selected-visible";

		/*
		var tileId:string = aElementId.split("profiles-tile-")[1];
		var p:Profile = <Profile>this.mListComponent.GetDataByID(tileId);

		var detailsView:HTMLElement = document.getElementById("profiles-selected-selection");
		var noSelectionView:HTMLElement = document.getElementById("profiles-selected-noSelection");
		detailsView.style.display = "block";
		noSelectionView.style.display = "none";
		*/
	}
}
