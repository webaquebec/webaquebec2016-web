import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import ExploreController from "../explore/ExploreController"

export default class ContactController extends EventDispatcher {

	private mContactView:AbstractView;

	private mExploreRestaurants:ExploreController;
	private mExploreHotels:ExploreController;
	private mExploreParking:ExploreController;
	private mExploreShopping:ExploreController;

	private mExploreContainer:HTMLElement;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mContactView = new AbstractView();
		this.mContactView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mContactView.LoadTemplate("templates/contact/contact.html");
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("contact-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mContactView.Destroy();
		this.mContactView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mContactView.RenderTemplate({});
		this.mContactView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		this.mExploreContainer = document.getElementById("contact-locations");
		this.CreateControllers();
	}

	private CreateControllers():void {
		this.mExploreRestaurants = this.CreateExploreController("Restaurants", "pin-restaurant");
		this.mExploreHotels = this.CreateExploreController("Hôtels", "pin-hotel");
		this.mExploreParking = this.CreateExploreController("Stationnements", "pin-parking");
		this.mExploreShopping = this.CreateExploreController("Magasins", "pin-shop");
	}

	private CreateExploreController(aName:string, aImage:string):ExploreController {
		var controller:ExploreController = new ExploreController(aName, aImage);
		controller.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnExploreTemplateLoaded, this);
		return controller;
	}

	private OnExploreTemplateLoaded(aEvent:MVCEvent):void {
		var controller:ExploreController = <ExploreController>aEvent.target;
		controller.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnExploreTemplateLoaded, this);
		controller.InsertInto(this.mExploreContainer);
	}
}
