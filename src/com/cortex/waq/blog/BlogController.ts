import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import INavigable from "../../core/navigation/INavigable";
import NavigationManager from "../../core/navigation/NavigationManager";

export default class BlogController extends EventDispatcher implements INavigable {
	
	private static routeList:Array<string> = ["blog"];
	
	private mBlogView:AbstractView;
	
	constructor() {
		super();
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void {
		this.mBlogView = new AbstractView();
		this.mBlogView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mBlogView.LoadTemplate("templates/blog/blog.html");
	}
	
	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("blogView");
		document.getElementById("core").removeChild(scheduleHTMLElement);
		
		this.mBlogView.Destroy();
		this.mBlogView = null;
	}
	
	public GetRouteList():Array<string> {
		return BlogController.routeList;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("core").innerHTML += this.mBlogView.RenderTemplate({});
		this.mBlogView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	}
	
}