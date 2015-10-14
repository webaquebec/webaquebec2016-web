import AbstractModel = 		require("../../core/mvc/AbstractModel");

import HomeController = 	require("../home/HomeController");

import MenuItem = 			require("./data/MenuItem")

import ScheduleController = require("../schedule/ScheduleController");

class MenuItemModel extends AbstractModel {
	
	private static mInstance:MenuItemModel;
	
	public static GetInstance():MenuItemModel {
		if (MenuItemModel.mInstance == null)
			MenuItemModel.mInstance = new MenuItemModel();
		return MenuItemModel.mInstance;
	}
	
	private mMenuItems:Array<MenuItem>;
	
	constructor() {
		super();
		
		this.CreateMenuItems();
	}
	
	private CreateMenuItems():void {
		this.mMenuItems = [];
		var item:MenuItem = new MenuItem();
		item.name = "Accueil"; item.action = ""; item.controller = HomeController;
		this.mMenuItems.push(item);
		item = new MenuItem();
		item.name = "Conférences"; item.action = "schedule"; item.controller = ScheduleController;
		this.mMenuItems.push(item);
	}
	
	public GetMenuItems():Array<MenuItem> {
		return this.mMenuItems;
	}
	
}

export = MenuItemModel;