import ComponentData = 	require("../../../core/component/data/ComponentData");

import IDestroyable = 	require("../../../core/garbage/IDestroyable");

class MenuItem extends ComponentData implements IDestroyable {
	
	private mName:string;
	private mAction:string;
	private mController:any;
	
	constructor() {
		super();
	}
	
	public Destroy():void {}
	
	public get name():string { return this.mName; }
	public set name(aName:string) { this.mName = aName; }
	
	public get action():string { return this.mAction; }
	public set action(aAction:string) { this.mAction = aAction; }
	
	public get controller():any { return this.mController; }
	public set controller(aController:any) { this.mController = aController; }
	
}

export = MenuItem;