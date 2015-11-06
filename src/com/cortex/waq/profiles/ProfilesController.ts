import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import Profile from "./data/Profile"

export default class ProfilesController extends EventDispatcher {

	private mProfilesView:AbstractView;

	private mProfiles:Array<Profile>;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");

		this.mProfiles = [];
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("profiles-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mProfilesView.Destroy();
		this.mProfilesView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});
		this.mProfilesView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
		this.CreateProfileTiles();
	}

	private CreateProfileTiles():void {
		var grid:HTMLElement = document.getElementById("profiles-grid");
		for (var i:number = 0, iMax:number = 25; i < iMax; i++) {
			grid.innerHTML += '<div class="profiles-tile" style="background-image: url(\'img/p1.png\');"></div>';
		}
	}
}
