import EventDispatcher from "../../core/event/EventDispatcher";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import { Router } from "cortex-toolkit-js-router";

import MenuEvent from "../menu/event/MenuEvent";
import MenuController from "../menu/MenuController";

export default class HeaderController extends EventDispatcher {

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

		this.mMenuController = new MenuController();
		this.mMenuController.AddEventListener(MenuEvent.CLOSE_MENU, this.OnMenuClose, this);
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("header-view").innerHTML += this.mHeaderView.RenderTemplate({});
		this.mHeaderView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		this.mHeaderView.AddClickControl(document.getElementById("header-button-menu"));
		this.mHeaderView.AddClickControl(document.getElementById("header-button-tickets"));
		this.mHeaderView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id == "header-button-menu") {
			
			this.OnMenuClicked();

		}else if (element.id == "header-button-tickets") {

			this.OnTicketsClicked();
		}
	}

	private OnMenuClicked():void {
		this.HideMenuButton();
		this.mMenuController.Show();
	}

	private OnTicketsClicked():void {
		Router.GetInstance().Navigate("billets");
	}

	public OnMenuClose():void {

		if (document.getElementById("header-view") == null){ return; }

		this.ShowMenuButton();
		this.mMenuController.Hide();
	}

	private HideMenuButton():void {
		var menu:HTMLElement = document.getElementById("header-view");
		menu.className = "hidden";
	}

	private ShowMenuButton():void {
		var menu:HTMLElement = document.getElementById("header-view");
		menu.className = "";
	}

}
