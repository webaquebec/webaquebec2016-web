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
	
	private mActions:Array<{routes:string[], callback:()=>void}>;
	private mSwipeDirection:number;
	private mIsAnimating:boolean;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		MenuItemModel.GetInstance();
		
		this.mActions = [
				{routes: ["", "home"], callback:this.ShowHomeScreen.bind(this)},
				{routes: ["tickets"], callback:this.ShowTickets.bind(this)},
				{routes: ["conferences"], callback:this.ShowConferences.bind(this)},
				{routes: ["schedule"], callback:this.ShowSchedule.bind(this)},
				{routes: ["volunteers"], callback:this.ShowVolunteers.bind(this)},
				{routes: ["partners"], callback:this.ShowPartners.bind(this)},
				{routes: ["contact"], callback:this.ShowContact.bind(this)}
			];
			
		this.mIsAnimating = false;
		
		this.mHeaderController = new HeaderController();
		this.SetupRouting();
	}
	
	public KeyPressed(aKeyList:Array<number>):void {
	}
	
	private SetupRouting():void {
		var router:Router = Router.GetInstance();
		for (var i:number = 0; i < this.mActions.length; i++) {
			for (var j:number = 0; j < this.mActions[i].routes.length; j++) {
				router.AddHandler(this.mActions[i].routes[j], this.mActions[i].callback);
			}
		}
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
		if (aName == this.mCurrentAction || this.mIsAnimating) return;
		aName = (aName == null) ? "" : aName;
		
		this.SetSwipeDirection(aName);
		this.PositionLoaderDiv();
		this.mCurrentAction = aName;
		
		this.mPreviousController = this.mCurrentController;
		this.mCurrentController = new aControllerClass();
		this.mCurrentController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	}
	
	private SetSwipeDirection(aName:string):void {
		var indexNew:number = -1;
		var indexOld:number = -1;
		
		loop:
		for (var i:number = 0; i < this.mActions.length; i++) {
			for (var j:number = 0; j < this.mActions[i].routes.length; j++) {
				if (this.mActions[i].routes[j] == this.mCurrentAction) indexOld = i;
				if (this.mActions[i].routes[j] == aName) indexNew = i;
				if (indexNew >= 0 && indexOld >= 0) break loop;
			}
		}
		
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
		
		// Classe pour l'animation
		if (this.mPreviousController == null) {
			var contentCurrent:HTMLDivElement = <HTMLDivElement>document.getElementById("content-current");
			var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
			contentCurrent.id = "content-loading";
			contentLoading.id = "content-current";
		}
		else {
			window.setTimeout(this.TriggerAnimation.bind(this), 100);
			this.mIsAnimating = true;
		}
	}
	
	private TriggerAnimation():void {
		var contentCurrent:HTMLDivElement = <HTMLDivElement>document.getElementById("content-current");
		var contentLoading:HTMLDivElement = <HTMLDivElement>document.getElementById("content-loading");
		contentCurrent.className = "animated";
		contentLoading.className = "animated";
		contentCurrent.style.transform = this.mSwipeDirection > 0 ? "translateX(-100%)" : "translateX(100%)";
		contentLoading.style.transform = "translateX(0)"
		window.setTimeout(this.FinishControllerTransition.bind(this), 700);
	}
	
	private FinishControllerTransition():void {
		this.mIsAnimating = false;
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