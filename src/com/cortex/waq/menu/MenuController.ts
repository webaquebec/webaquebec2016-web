import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = require("../../core/mvc/AbstractView");
import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");

import MVCEvent = require("../../core/mvc/event/MVCEvent");

import NavigationManager = require("../../core/navigation/NavigationManager");
import MenuEvent = require("./event/MenuEvent");

class MenuController extends AbstractController {
	
	private mMenuView:AbstractView;
	
	constructor() {
		super();
	}
	
	public Init(aAction:string):void {
		this.mMenuView = new AbstractView();
		this.mMenuView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mMenuView.LoadTemplate("templates/menu/menu.html");
	}
	
	public Destroy():void {
		var menuHTMLElement:HTMLElement = document.getElementById("menuView");
		document.getElementById("overlay").removeChild(menuHTMLElement);
		
		this.mMenuView.Destroy();
		this.mMenuView = null;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("overlay").innerHTML += this.mMenuView.RenderTemplate({});
		this.mMenuView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		this.mMenuView.AddClickControl(document.getElementById("menu-close"));
		this.mMenuView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		if (document.readyState == "complete" || document.readyState == "interactive") {
			// this.OnDeviceReady();
		}
		else {
			// document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
		}
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if (element.id == "menu-close") {
			this.OnMenuClose();
		}
	}
	
	private OnMenuClose():void {
		this.DispatchEvent(new MenuEvent(MenuEvent.CLOSE_MENU));
	}
}

export = MenuController;