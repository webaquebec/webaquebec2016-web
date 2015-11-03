import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

export default class ProfilesController extends EventDispatcher {
	
	private mProfilesView:AbstractView;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
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
	}
	
}