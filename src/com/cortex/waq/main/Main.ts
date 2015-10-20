import EventDispatcher from "../../core/event/EventDispatcher";

import IKeyBindable from "../../core/key/IKeyBindable";

import MVCEvent from "../../core/mvc/event/MVCEvent";

import Router from "../../core/router/Router";

import HeaderController from "../header/HeaderController";

import ContactController from "../contact/ContactController";

import HomeController from "../home/HomeController";

import MenuController from "../menu/MenuController";
import MenuItemModel from "../menu/MenuItemModel";

import ProfileController from "../profile/ProfileController";

import ScheduleController from "../schedule/ScheduleController";

import TicketsController from "../tickets/TicketsController";

export default class Main extends EventDispatcher implements IKeyBindable {
	
	private mHeaderController:HeaderController;
	private mCurrentController:EventDispatcher;
	private mPreviousController:EventDispatcher;
	private mCurrentAction:string;
	
	private mActions:Array<string>;
	private mSwipeDirection:number;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		MenuItemModel.GetInstance();
		
		this.mActions = ["home", "tickets", "conferences", "schedule", "volunteers", "partners", "contact"];
		
		this.mHeaderController = new HeaderController();
		this.SetupRouting();
	}
	
	public KeyPressed(aKeyList:Array<number>):void {
	}
	
	private SetupRouting():void {
		var router:Router = Router.GetInstance();
		router.AddHandler("", this.ShowHomeScreen.bind(this));
		router.AddHandler("tickets", this.ShowTickets.bind(this));
		router.AddHandler("conferences", this.ShowConferences.bind(this));
		router.AddHandler("schedule", this.ShowSchedule.bind(this));
		router.AddHandler("volunteers", this.ShowVolunteers.bind(this));
		router.AddHandler("partners", this.ShowPartners.bind(this));
		router.AddHandler("contact", this.ShowContact.bind(this));
		router.Reload();
	}
	
	private ShowHomeScreen():void {
		this.SetupNavigable("home", HomeController);
	}
	
	private ShowTickets():void {
		this.SetupNavigable("tickets", TicketsController);
	}
	
	private ShowConferences():void {
		this.SetupNavigable("conferences", ScheduleController);
	}
	
	private ShowSchedule():void {
		this.SetupNavigable("schedule", ScheduleController);
	}
	
	private ShowVolunteers():void {
		this.SetupNavigable("volunteers", ProfileController);
	}
	
	private ShowPartners():void {
		this.SetupNavigable("partners", ProfileController);
	}
	
	private ShowContact():void {
		this.SetupNavigable("contact", ContactController);
	}
	
	private SetupNavigable(aName:string, aControllerClass:any):void {
		if (aName == this.mCurrentAction) return;
		aName = (aName == null) ? "" : aName;
		
		this.SetSwipeDirection(aName);
		this.PositionLoaderDiv();
		this.mCurrentAction = aName;
		
		this.mPreviousController = this.mCurrentController;
		this.mCurrentController = new aControllerClass();
		this.mCurrentController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	}
	
	private SetSwipeDirection(aName:string):void {
		var indexNew:number = this.mActions.indexOf(aName);
		var indexOld:number = this.mActions.indexOf(this.mCurrentAction);
		this.mSwipeDirection = indexNew - indexOld;
	}
	
	private PositionLoaderDiv():void {
		var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
		if (contentLoading != null) {
			contentLoading.style.transform = this.mSwipeDirection > 0 ? "translateX(100%)" : "translateX(-100%)";
		}
	}
	
	private OnNewControllerLoaded():void {
		this.mCurrentController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
		var contentCurrent:HTMLDivElement = <HTMLDivElement>document.getElementById("content-current");
		var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
		
		if (this.mPreviousController == null) {
			contentCurrent.id = "content-loading";
			contentLoading.id = "content-current";
		}
		else {
			contentCurrent.className = "animated";
			contentLoading.className = "animated";
			contentCurrent.style.transform = this.mSwipeDirection > 0 ? "translateX(-100%)" : "translateX(100%)";
			contentLoading.style.transform = "translateX(0)"
			window.setTimeout(this.FinishControllerTransition.bind(this), 700);
		}
	}
	
	private FinishControllerTransition():void {
		this.mPreviousController.Destroy();
		this.mPreviousController = null;
		var contentCurrent:HTMLDivElement = <HTMLDivElement>document.getElementById("content-current");
		var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
		contentCurrent.className = "";
		contentLoading.className = "";
		contentCurrent.id = "content-loading";
		contentLoading.id = "content-current";
	}
	
}

new Main();