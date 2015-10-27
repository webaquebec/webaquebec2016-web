import EventDispatcher from "../../core/event/EventDispatcher";

import IKeyBindable from "../../core/key/IKeyBindable";
import KeyManager from "../../core/key/KeyManager";

import MVCEvent from "../../core/mvc/event/MVCEvent";

import Router from "../../core/router/Router";

import AnimationEvent from "../animation/event/AnimationEvent";
import AnimationController from "../animation/AnimationController";

import ContactController from "../contact/ContactController";

import HeaderController from "../header/HeaderController";

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
	
	private mAnimationController:AnimationController;
	private mActions:Array<{routes:string[], callback:()=>void}>;
	//private mSwipeDirection:number;
	//private mIsAnimating:boolean;
	
	private mKeyLeft:boolean;
	private mKeyRight:boolean;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		KeyManager.Register(this);
		
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
		
		this.mKeyLeft = false;
		this.mKeyRight = false;
		
		this.mHeaderController = new HeaderController();
		this.mAnimationController = new AnimationController();
		this.SetupRouting();
	}
	
	public KeyPressed(aKeyList:Array<number>):void {
		if (this.mAnimationController.IsAnimating) return;
		
		if (!this.mKeyLeft && aKeyList.indexOf(37) != -1) {
			// todo close menu
			this.NavigateLeft();
		}
		
		if (!this.mKeyRight && aKeyList.indexOf(39) != -1) {
			// todo close menu
			this.NavigateRight();
		}
		
		this.mKeyLeft = aKeyList.indexOf(37) != -1;
		this.mKeyRight = aKeyList.indexOf(39) != -1;
	}
	
	public KeyReleased(aKeyList:Array<number>):void {
		this.mKeyLeft = aKeyList.indexOf(37) != -1;
		this.mKeyRight = aKeyList.indexOf(39) != -1;
	}
	
	private NavigateLeft():void {
		var currentPageIndex:number = this.GetPageIndex(this.mCurrentAction);
		if (currentPageIndex - 1 >= 0) {
			Router.GetInstance().Navigate(this.mActions[currentPageIndex - 1].routes[0]);
		}
	}
	
	private NavigateRight():void {
		var currentPageIndex:number = this.GetPageIndex(this.mCurrentAction);
		if (currentPageIndex + 1 < this.mActions.length) {
			Router.GetInstance().Navigate(this.mActions[currentPageIndex + 1].routes[0]);
			
		}
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
		if (aName == this.mCurrentAction || this.mAnimationController.IsAnimating) return;
		this.mCurrentAction = (aName == null) ? "" : aName;
		
		this.mPreviousController = this.mCurrentController;
		this.mCurrentController = new aControllerClass();
		
		this.mAnimationController.PrepareToAnimateTo(this.GetPageIndex(this.mCurrentAction));
		this.mCurrentController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	}
	
	private GetPageIndex(aAction:string):number {
		for (var i:number = 0; i < this.mActions.length; i++) {
			for (var j:number = 0; j < this.mActions[i].routes.length; j++) {
				if (this.mActions[i].routes[j] == aAction) return i;
			}
		}
		
		return -1;
	}
	
	private OnNewControllerLoaded():void {
		this.mCurrentController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
		this.mAnimationController.AddEventListener(AnimationEvent.ANIMATION_FINISHED, this.OnAnimationFinished, this);
		this.mAnimationController.AnimateContent();
	}
	
	private OnAnimationFinished():void {
		this.mAnimationController.RemoveEventListener(AnimationEvent.ANIMATION_FINISHED, this.OnAnimationFinished, this);
		this.mPreviousController.Destroy();
		this.mPreviousController = null;
	}
}

new Main();