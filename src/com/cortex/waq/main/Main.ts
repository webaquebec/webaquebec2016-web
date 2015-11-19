import EventDispatcher from "../../core/event/EventDispatcher";

import IKeyBindable from "../../core/key/IKeyBindable";
import KeyManager from "../../core/key/KeyManager";

import MouseSwipeEvent from "../../core/mouse/event/MouseSwipeEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";

import { Router } from "cortex-toolkit-js-router";

import IAction from "./IAction";

import AnimationEvent from "../animation/event/AnimationEvent";
import AnimationController from "../animation/AnimationController";

import ContactController from "../contact/ContactController";

import HeaderController from "../header/HeaderController";

import HomeController from "../home/HomeController";

import MenuController from "../menu/MenuController";

import ProfilesController from "../profiles/ProfilesController";

import ScheduleController from "../schedule/ScheduleController";

import SwipeController from "../swipe/SwipeController";

import TicketsController from "../tickets/TicketsController";

export default class Main extends EventDispatcher implements IKeyBindable {

	private static KEY_LEFT:number = 37;
	private static KEY_RIGHT:number = 39;

	private static CORE_ELEMENT_ID:string = "core";

	private mHeaderController:HeaderController;
	private mCurrentController:EventDispatcher;
	private mPreviousController:EventDispatcher;
	private mCurrentAction:string;

	private mAnimationController:AnimationController;
	private mActions:Array<IAction>;
	private mTotalActions:number;

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
				{routes: ["speakers"], callback:this.ShowSpeakers.bind(this)},
				{routes: ["schedule"], callback:this.ShowSchedule.bind(this)},
				{routes: ["volunteers"], callback:this.ShowVolunteers.bind(this)},
				{routes: ["partners"], callback:this.ShowPartners.bind(this)},
				{routes: ["contact"], callback:this.ShowContact.bind(this)}
			];
		this.mTotalActions = this.mActions.length;

		this.mKeyLeft = false;
		this.mKeyRight = false;

		this.mHeaderController = new HeaderController();
		this.mAnimationController = new AnimationController();
		this.SetupRouting();

		this.mSwipeController = new SwipeController();
		this.mSwipeController.AddEventListener(MouseSwipeEvent.SWIPE_LEFT, this.OnSwipeLeftEvent, this);
		this.mSwipeController.AddEventListener(MouseSwipeEvent.SWIPE_RIGHT, this.OnSwipeRightEvent, this);

		document.addEventListener('DOMContentLoaded', this.OnContentLoaded.bind(this), false);
	}

	private OnContentLoaded():void {
		document.removeEventListener('DOMContentLoaded', this.OnContentLoaded.bind(this), false);
		this.mSwipeController.InitOnElement(Main.CORE_ELEMENT_ID);
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
		if (nextPageIndex >= 0 && nextPageIndex < this.mTotalActions) {
			Router.GetInstance().Navigate(this.mActions[nextPageIndex].routes[0]);
		}
	}

	private SetupRouting():void {
		var router:Router = Router.GetInstance();
		for (var i:number = 0, iMax:number = this.mTotalActions; i < iMax; i++) {
			var currentAction:IAction = this.mActions[i];
			var currentRoutes:Array<string> = currentAction.routes;
			for (var j:number = 0, jMax:number = currentRoutes.length; j < jMax; j++) {
				router.AddHandler(currentRoutes[j], currentAction.callback);
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

	private ShowSpeakers():void {
		this.SetupNavigable("speakers", ProfilesController);
	}

	private ShowSchedule():void {
		this.SetupNavigable("schedule", ScheduleController);
	}

	private ShowVolunteers():void {
		this.SetupNavigable("volunteers", ProfilesController);
	}

	private ShowPartners():void {
		this.SetupNavigable("partners", ProfilesController);
	}

	private ShowContact():void {
		this.SetupNavigable("contact", ContactController);
	}

	private SetupNavigable(aName:string, aControllerClass:any):void {
		if (aName === this.mCurrentAction || this.mAnimationController.IsAnimating) return;
		this.mCurrentAction = (aName == null) ? "" : aName;

		this.mPreviousController = this.mCurrentController;
		this.mCurrentController = new aControllerClass();

		this.mAnimationController.PrepareToAnimateTo(this.GetPageIndex(this.mCurrentAction));
		this.mCurrentController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	}

	private GetPageIndex(aAction:string):number {
		for (var i:number = 0, iMax = this.mTotalActions; i < iMax; i++) {
			var currentRoutes:Array<string> = this.mActions[i].routes;
			for (var j:number = 0, totalRoutes:number = currentRoutes.length; j < totalRoutes; j++) {
				if (currentRoutes[j] === aAction) return i;
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
