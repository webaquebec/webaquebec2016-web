import MVCEvent = 			require("../../core/mvc/event/MVCEvent");
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
		this.AddEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
		this.Fetch("json/waq/menu_items.json");
	}
	
	private OnJSONLoaded():void {
		this.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
		var json:Array<Object> = this.GetData("json/waq/menu_items.json");
		
		this.mMenuItems = [];
		var totalItems:number = json.length;
		for (var i:number = 0; i < totalItems; i++) {
			var item:MenuItem = new MenuItem();
			item.FromJSON(json[i]);
			this.mMenuItems.push(item);
		}
		
		this.mMenuItems.sort(function(a:MenuItem, b:MenuItem):number {
			if (a.order < b.order) return -1;
			if (a.order > b.order) return 1;
			return 0;
		});
	}
	
	public GetMenuItems():Array<MenuItem> {
		return this.mMenuItems;
	}
	
}

export = MenuItemModel;