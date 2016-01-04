import EventDispatcher from "../../core/event/EventDispatcher";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import { Router } from "cortex-toolkit-js-router";

import MVCEvent from "../../core/mvc/event/MVCEvent";
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

		this.mHomeView.AddClickControl(document.getElementById("home-video"));
		this.mHomeView.AddClickControl(document.getElementById("home-title-schedule"));

		this.mHomeView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.AddCloudsToElement("home-cloudContainer-1", 12);
		this.AddCloudsToElement("home-cloudContainer-2", 12);
		this.AddCloudsToElement("home-cloudContainer-3", 12);
		this.AddCloudsToElement("home-cloudContainer-4", 12);
		/* tslint:disable */
		if (window["twttr"] != null && window["twttr"].widgets != null) {
			window["twttr"].widgets.load();
		}
		/* tslint:enable */
		//console.log(window["twttr"]);
	}

	private AddCloudsToElement(aElementId:string, aCloudCount:number):void {
		var element:HTMLElement = document.getElementById(aElementId);
		for (var i:number = 0; i < aCloudCount; i++) {
			element.innerHTML += "<div class='cloud'></div>";
		}
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id == "home-video") {
			
			this.OnVideoClicked(element);

		} else if(element.id == "home-title-schedule"){

			Router.GetInstance().Navigate("horaire");
		}
	}

	private OnVideoClicked(element:HTMLElement):void {
		element.className = "home-split";
		element.innerHTML = "<iframe width='100% height='100%' src='https://www.youtube.com/embed/p8-Sv0GKG-U?autoplay=1&rel=0'" +
							"frameborder='0' allowfullscreen></iframe>";
		this.mHomeView.RemoveClickControl(element);
	}
}
