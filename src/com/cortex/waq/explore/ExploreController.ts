import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

export default class ExploreController extends EventDispatcher {

	private mParentView:HTMLElement;

	private mExploreView:AbstractView;
	private mData:any;

	constructor(aName:string, aImage:string) {
		super();
		this.Init(aName, aImage);
	}

	public Init(aName:string, aImage:string):void {
		this.mExploreView = new AbstractView();
		this.mExploreView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mExploreView.LoadTemplate("templates/explore/explore.html");
		this.mData = { "name": aName, "image":aImage };
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
		aElement.innerHTML += this.mExploreView.RenderTemplate(this.mData);
	}
}
