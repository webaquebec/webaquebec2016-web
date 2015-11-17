import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

export default class ExploreController extends EventDispatcher {

	private mParentView:HTMLElement;

	private mExploreView:AbstractView;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mExploreView = new AbstractView();
		this.mExploreView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mExploreView.LoadTemplate("templates/explore/explore.html");
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("contact-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mExploreView.Destroy();
		this.mExploreView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		this.mExploreView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		var event:MVCEvent = new MVCEvent(MVCEvent.TEMPLATE_LOADED);
		event.target = this;
		this.DispatchEvent(event);
	}

	public InsertInto(aElement:HTMLElement) {
		this.mParentView = aElement;
		aElement.innerHTML += this.mExploreView.RenderTemplate({});
	}
}
