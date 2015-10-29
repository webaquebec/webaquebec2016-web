import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import MenuItem from "./data/MenuItem";
import MenuEvent from "./event/MenuEvent";

export default class MenuItemModel extends AbstractModel {
	
	private static mInstance:MenuItemModel;
	
	public static GetInstance():MenuItemModel {
		if (MenuItemModel.mInstance == null)
			MenuItemModel.mInstance = new MenuItemModel();
		return MenuItemModel.mInstance;
	}
	
	private mMenuItems:Array<MenuItem>;
	
	constructor() {
		super();
		
		this.mMenuItems = [];
		this.CreateMenuItems();
	}
	
	private CreateMenuItems():void {
		this.Fetch("json/waq/menu_items.json");
	}
	
	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {
		super.OnJSONLoadSuccess(aJSONData, aURL);
		
		var json:Array<Object> = aJSONData;
		var totalItems:number = json.length;
		for (var i:number = 0; i < totalItems; i++) {
			var menuItem:MenuItem = new MenuItem();
			menuItem.FromJSON(json[i]);
			this.mMenuItems.push(menuItem);
		}
		
		this.DispatchEvent(new MenuEvent(MenuEvent.ITEMS_READY));
	}
	
	public GetMenuItems():Array<MenuItem> {
		return this.mMenuItems;
	}
	
}