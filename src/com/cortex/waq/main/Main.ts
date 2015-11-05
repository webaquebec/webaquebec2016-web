import EventDispatcher from "../../core/event/EventDispatcher";

import IKeyBindable from "../../core/key/IKeyBindable";
import KeyManager from "../../core/key/KeyManager";

import MouseSwipeEvent from "../../core/mouse/event/MouseSwipeEvent";
import TouchBehavior from "../../core/mouse/TouchBehavior";

import MVCEvent from "../../core/mvc/event/MVCEvent";

import { Router } from "cortex-toolkit-js-router";

import AnimationEvent from "../animation/event/AnimationEvent";
import AnimationController from "../animation/AnimationController";

import ContactController from "../contact/ContactController";

import HeaderController from "../header/HeaderController";

import HomeController from "../home/HomeController";

import MenuController from "../menu/MenuController";

import ProfileController from "../profile/ProfileController";

import ScheduleController from "../schedule/ScheduleController";

import SwipeController from "../swipe/SwipeController";

import TicketsController from "../tickets/TicketsController";

export default class Main extends EventDispatcher implements IKeyBindable {

	private static KEY_LEFT:number = 37;
	private static KEY_RIGHT:number = 39;

	private mHeaderController:HeaderController;
	private mCurrentController:EventDispatcher;
	private mPreviousController:EventDispatcher;
	private mCurrentAction:string;

	private mAnimationController:AnimationController;
	private mActions:Array<{routes:string[], callback:()=>void}>;

	private mTouchBehavior:TouchBehavior;
	private mSwipeController:SwipeController;

	private mKeyLeft:boolean;
	private mKeyRight:boolean;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		KeyManager.Register(this);

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

		this.mSwipeController = new SwipeController();
		this.mSwipeController.AddEventListener(MouseSwipeEvent.SWIPE_LEFT, this.OnSwipeLeftEvent, this);
		this.mSwipeController.AddEventListener(MouseSwipeEvent.SWIPE_RIGHT, this.OnSwipeRightEvent, this);
	}

	public KeyPressed(aKeyList:Array<number>):void {
		if (!this.mKeyLeft && aKeyList.indexOf(Main.KEY_LEFT) != -1) {
			this.NavigateSideways(-1);
		}

		if (!this.mKeyRight && aKeyList.indexOf(Main.KEY_RIGHT) != -1) {
			this.NavigateSideways(1);
		}

		if (!this.mAnimationController.IsAnimating)
			this.UpdateKeyStates(aKeyList);
	}

	public KeyReleased(aKeyList:Array<number>):void {
		this.UpdateKeyStates(aKeyList);
	}

	private UpdateKeyStates(aKeyList:Array<number>):void {
		this.mKeyLeft = aKeyList.indexOf(Main.KEY_LEFT) != -1;
		this.mKeyRight = aKeyList.indexOf(Main.KEY_RIGHT) != -1;
	}

	private OnSwipeLeftEvent(aEvent:MouseSwipeEvent):void {
		this.NavigateSideways(-1);
	}

	private OnSwipeRightEvent(aEvent:MouseSwipeEvent):void {
		this.NavigateSideways(1);
	}

	private NavigateSideways(aDirection:number) {
		if (this.mAnimationController.IsAnimating) return;
		this.mHeaderController.OnMenuClose();
		var nextPageIndex:number = this.GetPageIndex(this.mCurrentAction) + aDirection;
		if (nextPageIndex >= 0 && nextPageIndex < this.mActions.length) {
			Router.GetInstance().Navigate(this.mActions[nextPageIndex].routes[0]);
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

		this.CreateTouchListener();
	}

	private OnAnimationFinished():void {
		this.mAnimationController.RemoveEventListener(AnimationEvent.ANIMATION_FINISHED, this.OnAnimationFinished, this);
		this.mPreviousController.Destroy();
		this.mPreviousController = null;
	}

	private CreateTouchListener():void {
		if (this.mTouchBehavior != null) return;

		this.mTouchBehavior = new TouchBehavior();
		var coreElement:HTMLElement = document.getElementById("core");
		this.mTouchBehavior.AddClickControl(coreElement);
		this.mTouchBehavior.AddEventListener(MouseSwipeEvent.SWIPE_BEGIN, this.OnMouseSwipeEvent, this);
		this.mTouchBehavior.AddEventListener(MouseSwipeEvent.SWIPE_MOVE, this.OnMouseSwipeEvent, this);
		this.mTouchBehavior.AddEventListener(MouseSwipeEvent.SWIPE_END, this.OnMouseSwipeEvent, this);
	}

	private OnMouseSwipeEvent(aEvent:MouseSwipeEvent):void {
		this.mSwipeController.OnSwipeEvent(aEvent);
	}
}

new Main();
