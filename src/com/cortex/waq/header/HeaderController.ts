import AbstractView = require("../../core/mvc/AbstractView");
import EventDispatcher = require("../../core/event/EventDispatcher");
import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import NavigationManager = require("../../core/navigation/NavigationManager");

import MenuController = require("../menu/MenuController");
import MenuEvent = require("../menu/event/MenuEvent");

class HeaderController extends EventDispatcher {

	private mHeaderView:AbstractView;
	private mMenuController:MenuController;
	
	constructor() {
		super();
		this.Init();
	}
	
	private Init():void {
		this.mHeaderView = new AbstractView();
		this.mHeaderView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mHeaderView.LoadTemplate("templates/header/header.html");
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("header-view").innerHTML += this.mHeaderView.RenderTemplate({});
		this.mHeaderView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		this.mHeaderView.AddClickControl(document.getElementById("open-menu"));
		this.mHeaderView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		if (document.readyState == "complete" || document.readyState == "interactive") {
			// this.OnDeviceReady();
		}
		else {
			// document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
		}
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if (element.id == "open-menu") {
			this.OnMenuClicked();
		}
	}
	
	private OnMenuClicked():void {
		this.mMenuController = new MenuController();
		this.mMenuController.Init("menu");
		this.mMenuController.AddEventListener(MenuEvent.CLOSE_MENU, this.OnMenuClose, this);
		this.HideMenuButton();
	}
	
	private OnMenuClose():void {
		this.mMenuController.RemoveEventListener(MenuEvent.CLOSE_MENU, this.OnMenuClose, this);
		this.mMenuController.Destroy();
		this.ShowMenuButton();
	}
	
	private HideMenuButton():void {
		var menu:HTMLElement = document.getElementById("headerView");
		menu.className = "hidden";
	}
	
	private ShowMenuButton():void {
		var menu:HTMLElement = document.getElementById("headerView");
		menu.className = "";
	}
	
}

export = HeaderController;