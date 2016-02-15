import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";
import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import { Router } from "cortex-toolkit-js-router";

export default class TicketsController extends EventDispatcher {

	private static routeList:Array<string> = ["tickets"];

	private mTicketsView:AbstractView;

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mTicketsView = new AbstractView();
		this.mTicketsView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mTicketsView.LoadTemplate("templates/tickets/tickets.html");
	}

	public Destroy():void {

		var scheduleHTMLElement:HTMLElement = document.getElementById("tickets-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mTicketsView.Destroy();
		this.mTicketsView = null;
	}

	public GetRouteList():Array<string> { return TicketsController.routeList; }

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		document.getElementById("content-loading").innerHTML += this.mTicketsView.RenderTemplate({});
        document.getElementById("header-content-title").innerHTML = "";

		document.title = "Billets";

		this.mTicketsView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		this.mTicketsView.AddClickControl(document.getElementById("tickets-info-button"));
        this.mTicketsView.AddClickControl(document.getElementById("tickets-eventbrite"));

		this.mTicketsView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
	}

    private OnScreenClicked(aEvent:MouseTouchEvent):void {

		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id == "tickets-info-button") {

			Router.GetInstance().Navigate("!contact");

		}else if (element.id == "tickets-eventbrite") {

			window.open("http://www.eventbrite.com/e/billets-web-a-quebec-2016-6e-edition-18295299734", "_blank");
		}
	}

}
