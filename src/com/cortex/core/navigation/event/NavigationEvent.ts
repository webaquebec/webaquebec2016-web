import Event = require("../../event/Event");

class NavigationEvent extends Event {
	
	static NAVIGATE_TO: string = "com.cortex.core.navigation.event.NavigationEvent::NAVIGATE_TO";
	
	private mAction:string;
	private mController:any;

	constructor(aEventName:string) {
		super(aEventName);
	}
	
	public setDestination(aAction:string, aController:any):void {
		this.mAction = aAction;
		this.mController = aController;
	}
	
	public get action():string {
		return this.mAction;
	}
	
	public get controller():any {
		return this.mController;
	}
	
}

export = NavigationEvent;