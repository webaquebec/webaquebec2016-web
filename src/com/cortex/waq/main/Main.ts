import EventDispatcher from "../../core/event/EventDispatcher";

import IKeyBindable from "../../core/key/IKeyBindable";

import NavigationEvent from "../../core/navigation/event/NavigationEvent";
import INavigable from "../../core/navigation/INavigable";
import NavigationManager from "../../core/navigation/NavigationManager";

import HeaderController from "../header/HeaderController";

import HomeController from "../home/HomeController";
import TicketsController from "../tickets/TicketsController";

import MenuController from "../menu/MenuController";
import MenuItemModel from "../menu/MenuItemModel";

import ConferenceModel from "../conference/ConferenceModel";

import Router from "../../core/router/Router";

export default class Main extends EventDispatcher implements IKeyBindable {
	
	private mHeaderController:HeaderController;
	private mLastController:EventDispatcher;
	private mLastActions:string;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		//MenuItemModel.GetInstance();
		ConferenceModel.GetInstance();
		
		this.mHeaderController = new HeaderController();
		this.mHeaderController.AddEventListener(NavigationEvent.NAVIGATE_TO, this.OnNavigateTo, this);
		this.SetupRouting();
	}
	
	public KeyPressed(aKeyList:Array<number>):void {
		
	}
	
	private SetupRouting():void {
		var router:Router = new Router("", this.ShowHomeScreen.bind(this));
		router.AddHandler("tickets", this.Test.bind(this));
	}
	
	private Test() {
		
	}
	
	private ShowHomeScreen():void {
		(<HomeController>this.SetupNavigable("home", HomeController)).Init("home");
	}
	
	private OnNavigateTo(ev:NavigationEvent):void {
		(<HomeController>this.SetupNavigable(ev.action, ev.controller)).Init("home");
	}
	
	private SetupNavigable(aName:string, aControllerClass:any):EventDispatcher {
		if (NavigationManager.NavigateTo(aName) == null) {
			this.mLastController = this.LoadNavigation(aName, new aControllerClass());
		}
		else {
			this.mLastController = this.LoadNavigation(aName);
		}
		return this.mLastController;
	}
	
	private LoadNavigation(aActions:string, aForceController:EventDispatcher = null):EventDispatcher {
		aActions = (aActions == null) ? "" : aActions;
		this.mLastActions = aActions;
		
		if (this.mLastController != null) {
			this.mLastController.Destroy();
		}
		
		this.mLastController = (aForceController != null) ?
			aForceController :
			<EventDispatcher><any>NavigationManager.NavigateTo(aActions.split("/")[0]);
		//this.mLastController.Init(aActions);
		return this.mLastController;
	}
	
}

new Main();