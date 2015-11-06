import ListComponent from "../../core/component/ListComponent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
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

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mProfilesView.Destroy();
		this.mProfilesView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});
		this.mProfilesView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		this.mListComponent.Init("profiles-grid");
		this.CreateProfileTiles();
	}

	private CreateProfileTiles():void {
		for (var i:number = 0, iMax:number = 25; i < iMax; i++) {
			var n:number = Math.ceil(Math.random() * 8);
			var p:Profile = new Profile(); p.photo = "p" + n + ".png";
			var profileTileView:AbstractView = new AbstractView();
			this.mListComponent.AddComponent(profileTileView, "templates/profiles/profileTile.html", p);
		}
	}
}
