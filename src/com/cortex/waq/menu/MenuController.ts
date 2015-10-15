import ListComponent = 		require("../../core/component/ListComponent");

import MouseTouchEvent = 	require("../../core/mouse/event/MouseTouchEvent");

import MVCEvent = 			require("../../core/mvc/event/MVCEvent");
import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = 		require("../../core/mvc/AbstractView");

import NavigationEvent = 	require("../../core/navigation/event/NavigationEvent");
import NavigationManager = 	require("../../core/navigation/NavigationManager");

import MenuItem = 			require("./data/MenuItem")
import MenuEvent = 			require("./event/MenuEvent");
import MenuItemModel = 		require("./MenuItemModel")

import ContactController = 	require("../contact/ContactController");

import HomeController = 	require("../home/HomeController");

import ProfileController =  require("../profile/ProfileController");

import ScheduleController = require("../schedule/ScheduleController");

import TicketsController =  require("../tickets/TicketsController");

class MenuController extends AbstractController {
	
	private mMenuView:AbstractView;
	private mListComponent:ListComponent;
	private mControllers:{[controllerName: string]:any};
	
	constructor() {
		super();
	}
	
	public Init(aAction:string):void {
		this.mMenuView = new AbstractView();
		this.mMenuView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mMenuView.LoadTemplate("templates/menu/menu.html");
		
		this.mControllers = {
			"": HomeController,
			"contact": ContactController,
			"tickets": TicketsController,
			"schedule": ScheduleController,
			"profile": ProfileController
		};
	}
	
	public Destroy():void {
		var menuHTMLElement:HTMLElement = document.getElementById("menuView");
		document.getElementById("overlay").removeChild(menuHTMLElement);
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mMenuView.Destroy();
		this.mMenuView = null;
	}
	
	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("overlay").innerHTML += this.mMenuView.RenderTemplate({});
		this.mMenuView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		this.mMenuView.AddClickControl(document.getElementById("menu-close"));
		this.mMenuView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mListComponent = new ListComponent();
		this.mListComponent.Init("menu-menuItems");
		
		this.GenerateMenuItems();
	}
	
	private GenerateMenuItems():void {
		var menuItems:Array<MenuItem> = MenuItemModel.GetInstance().GetMenuItems();
		var max:number = menuItems.length;
		for (var i:number = 0; i < max; i++) {
			var menuItemView:AbstractView = new AbstractView();
			menuItemView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnMenuItemTemplateLoaded, this);
			this.mListComponent.AddComponent(menuItemView, "templates/menu/menuItem.html", menuItems[i]);
		}
	}
	
	private OnMenuItemTemplateLoaded(aEvent:MVCEvent):void {
		var menuItem:MenuItem = <MenuItem>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		this.mMenuView.AddClickControl(document.getElementById("menu-menuItem" + menuItem.ID));
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if (element.id == "menu-close") {
			this.OnMenuClose();
		}
		else if (element.id.indexOf("menu-menuItem") >= 0) {
			this.OnMenuItemClicked(element.id);
		}
	}
	
	private OnMenuClose():void {
		this.DispatchEvent(new MenuEvent(MenuEvent.CLOSE_MENU));
	}
	
	private OnMenuItemClicked(elementId:string):void {
		var menuItemId:string = elementId.split("menu-menuItem")[1];
		var menuItem:MenuItem = <MenuItem>this.mListComponent.GetDataByID(menuItemId);
		
		var controller:any = this.mControllers[menuItem.action];
		var event:NavigationEvent = new NavigationEvent(NavigationEvent.NAVIGATE_TO);
		event.setDestination(menuItem.action, controller);
		
		this.DispatchEvent(event);
		this.DispatchEvent(new MenuEvent(MenuEvent.CLOSE_MENU));
	}
}

export = MenuController;