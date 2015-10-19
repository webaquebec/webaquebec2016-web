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
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		MenuItemModel.GetInstance();
		
		this.mHeaderController = new HeaderController();
		this.SetupRouting();
	}
	
	public KeyPressed(aKeyList:Array<number>):void {
	}
	
	private SetupRouting():void {
		var router:Router = Router.GetInstance();
		router.AddHandler("", this.ShowHomeScreen.bind(this));
		router.AddHandler("schedule", this.ShowSchedule.bind(this));
		router.AddHandler("tickets", this.ShowTickets.bind(this));
		router.AddHandler("profile", this.ShowProfile.bind(this));
		router.AddHandler("contact", this.ShowContact.bind(this));
		router.Reload();
	}
	
	private ShowHomeScreen():void {
		this.SetupNavigable("home", HomeController);
	}
	
	private ShowSchedule():void {
		this.SetupNavigable("schedule", ScheduleController);
	}
	
	private ShowTickets():void {
		this.SetupNavigable("tickets", TicketsController);
	}
	
	private ShowProfile():void {
		this.SetupNavigable("profile", ProfileController);
	}
	
	private ShowContact():void {
		this.SetupNavigable("contact", ContactController);
	}
	
	private SetupNavigable(aName:string, aControllerClass:any):void {
		if (aName == this.mCurrentAction) return;
			
		aName = (aName == null) ? "" : aName;
		this.mCurrentAction = aName;
		
		//if (this.mLastController != null) {
			//this.mLastController.Destroy();
		//}
		
		this.mPreviousController = this.mCurrentController;
		this.mCurrentController = new aControllerClass();
		this.mCurrentController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	}
	
	private OnNewControllerLoaded():void {
		this.mCurrentController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
		var contentCurrent:HTMLDivElement = <HTMLDivElement>document.getElementById("content-current");
		var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
		
		if (this.mPreviousController == null) {
			contentCurrent.id = "content-loading";
			contentLoading.id = "content-current";
			contentLoading.className = "position-none";
			contentCurrent.className = "position-right";
		}
		else {
			contentLoading.className = "position-none animated";
			contentCurrent.className = "position-left animated";
			window.setTimeout(this.FinishControllerTransition.bind(this), 700);
		}
	}
	
	private FinishControllerTransition():void {
		this.mPreviousController.Destroy();
		this.mPreviousController = null;
		var contentCurrent:HTMLDivElement = <HTMLDivElement>document.getElementById("content-current");
		var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
		contentCurrent.id = "content-loading";
		contentLoading.id = "content-current";
		contentLoading.className = "position-none";
		contentCurrent.className = "position-right";
	}
	
}

new Main();