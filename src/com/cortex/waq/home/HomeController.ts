import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

export default class HomeController extends EventDispatcher {
	
	private mHomeView:AbstractView;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		this.mHomeView = new AbstractView();
		this.mHomeView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mHomeView.LoadTemplate("templates/home/home.html");
	}
	
	public Destroy():void {
		var homeHTMLElement:HTMLElement = document.getElementById("home-view");
		document.getElementById("content-current").removeChild(homeHTMLElement);
		
		this.mHomeView.Destroy();
		this.mHomeView = null;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mHomeView.RenderTemplate({});
		this.mHomeView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
	}
	
}