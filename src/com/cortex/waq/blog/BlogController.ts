import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

var Masonry:any = require('masonry-layout');

export default class BlogController extends EventDispatcher {

	private static routeList:Array<string> = ["blog"];

	private mBlogView:AbstractView;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mBlogView = new AbstractView();
		this.mBlogView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mBlogView.LoadTemplate("templates/blog/blog.html");
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("blog-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mBlogView.Destroy();
		this.mBlogView = null;
	}

	public GetRouteList():Array<string> {
		return BlogController.routeList;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mBlogView.RenderTemplate({});
		this.mBlogView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		var m = new Masonry("#blog-grid", {
			itemSelector: ".blog-cell",
		});
	}

}
