import ComponentEvent from "../../core/component/event/ComponentEvent";
import ComponentBinding from "../../core/component/ComponentBinding";
import ListComponent from "../../core/component/ListComponent";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import { Router } from "cortex-toolkit-js-router";

import MenuItem from "./data/MenuItem";
import MenuEvent from "./event/MenuEvent";
import MenuItemModel from "./MenuItemModel";

export default class MenuController extends EventDispatcher {

	private mMenuView:AbstractView;
	private mListComponent:ListComponent;

	private mMenuItemsReady:boolean;
	private mWaitingOnItems:boolean;

	private mTotalItems:number;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mMenuItemsReady = false;
		this.mWaitingOnItems = false;
		MenuItemModel.GetInstance().AddEventListener(MenuEvent.ITEMS_READY, this.OnJSONParsed, this);

		this.mTotalItems = 0;
	}

	public Destroy():void {

		var menuHTMLElement:HTMLDivElement = <HTMLDivElement>document.getElementById("menu-view");
		(<HTMLDivElement>document.getElementById("overlay")).removeChild(menuHTMLElement);

		this.mMenuView.RemoveEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mMenuView.Destroy();
		this.mMenuView = null;

		super.Destroy();
	}

	public Hide():void {

		var menuHTMLElement:HTMLDivElement = <HTMLDivElement>document.getElementById("menu-view");

		if (menuHTMLElement != null){
			window.setTimeout(function() {
				menuHTMLElement.className = "hidden";
			}, 200);
		}
	}

	public Show():void {
		if (!this.mMenuItemsReady) {
			this.mWaitingOnItems = true;
			return;
		}

		var menuHTMLElement:HTMLDivElement = <HTMLDivElement>document.getElementById("menu-view");
		if (menuHTMLElement != null) {
			menuHTMLElement.className = "";
			menuHTMLElement.scrollTop = 0;
		}
	}

	private OnJSONParsed() {
		MenuItemModel.GetInstance().RemoveEventListener(MenuEvent.ITEMS_READY, this.OnJSONParsed, this);

		this.mMenuView = new AbstractView();
		this.mMenuView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mMenuView.LoadTemplate("templates/menu/menu.html");

		this.mMenuItemsReady = true;
		if (this.mWaitingOnItems) {
			this.mWaitingOnItems = false;
			this.Show();
		}
	}


	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("overlay").innerHTML += this.mMenuView.RenderTemplate({});
		this.mMenuView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		this.mMenuView.AddClickControl(document.getElementById("menu-close"));
		this.mMenuView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent = new ListComponent();
		this.mListComponent.Init("menu-itemContainer");

		this.GenerateMenuItems();

		this.Hide();
	}

	private GenerateMenuItems():void {

		var menuItems:Array<MenuItem> = MenuItemModel.GetInstance().GetMenuItems();

		menuItems.sort(function(a:MenuItem, b:MenuItem):number {
			if (a.order < b.order) {return -1};
			if (a.order > b.order) {return 1};
			return 0;
		});

		this.mTotalItems = menuItems.length;

		for (var i:number = 0; i < this.mTotalItems; i++) {

			this.mListComponent.AddComponent(new ComponentBinding(new AbstractView(), menuItems[i]));
		}

		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		this.mListComponent.LoadWithTemplate("templates/menu/menuItem.html")
	}

	private AllItemsReady():void {

		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);

		for (var i:number = 0, max:number = this.mTotalItems; i < max; i++) {
			this.mMenuView.AddClickControl(document.getElementById("menu-menuItem" + i.toString()));
		}
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id == "menu-close") {

			this.OnMenuClose();

		}else if (element.id.indexOf("menu-menuItem") >= 0) {

			this.OnMenuItemClicked(element.id);
		}
	}

	private OnMenuClose():void {
		this.DispatchEvent(new MenuEvent(MenuEvent.CLOSE_MENU));
	}

	private OnMenuItemClicked(aElementId:string):void {
		var menuItemId:string = aElementId.split("menu-menuItem")[1];
		var menuItem:MenuItem = <MenuItem>this.mListComponent.GetDataByID(menuItemId);

		Router.GetInstance().Navigate("!" + menuItem.action);
		this.DispatchEvent(new MenuEvent(MenuEvent.CLOSE_MENU));
	}
}
