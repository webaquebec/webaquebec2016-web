/// <reference path="../../../../../definitions/routie/routie.d.ts" />

import EventDispatcher = 	require("../../core/event/EventDispatcher");

import IKeyBindable = 		require("../../core/key/IKeyBindable");

import AbstractController = require("../../core/mvc/AbstractController");

import NavigationEvent = 	require("../../core/navigation/event/NavigationEvent");
import INavigable = 		require("../../core/navigation/INavigable");
import NavigationManager = 	require("../../core/navigation/NavigationManager");

import HeaderController = 	require("../header/HeaderController");

import HomeController = 	require("../home/HomeController");

import MenuController = 	require("../menu/MenuController");

class Main extends EventDispatcher implements IKeyBindable {
	
	private mHeaderController:HeaderController;
	private mLastController:AbstractController;
	private mLastActions:string;
	
	constructor() {
		super();
		this.Init();
	}
	
	public Init():void {
		this.mHeaderController = new HeaderController();
		this.mHeaderController.AddEventListener(NavigationEvent.NAVIGATE_TO, this.OnNavigateTo, this);
		this.SetupRouting();
	}
	
	public KeyPressed(aKeyList:Array<number>):void {
		
	}
	
	private SetupRouting():void {
		routie("", this.ShowHomeScreen.bind(this));
	}
	
	private ShowHomeScreen():void {
		this.SetupNavigable("home", HomeController);
	}
	
	private OnNavigateTo(ev:NavigationEvent):void {
		this.SetupNavigable(ev.action, ev.controller);
	}
	
	private SetupNavigable(aName:string, aControllerClass:any):void {
		if (NavigationManager.NavigateTo(aName) == null) {
			this.mLastController = this.LoadNavigation(aName, new aControllerClass());
		}
		else {
			this.mLastController = this.LoadNavigation(aName);
		}
	}
	
	private LoadNavigation(aActions:string, aForceController:AbstractController = null):AbstractController {
		aActions = (aActions == null) ? "" : aActions;
		this.mLastActions = aActions;
		
		if (this.mLastController != null) {
			this.mLastController.Destroy();
		}
		
		this.mLastController = (aForceController != null) ?
			aForceController :
			<AbstractController><any>NavigationManager.NavigateTo(aActions.split("/")[0]);
		this.mLastController.Init(aActions);
		return this.mLastController;
	}
	
}

export = Main;