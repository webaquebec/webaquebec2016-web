import Event = require("../../../core/event/Event");

class MenuEvent extends Event {
	
	static SHOW_MENU: string = "com.cortex.waq.menu.event.MenuEvent::SHOW_MENU";
	static CLOSE_MENU: string = "com.cortex.waq.menu.event.MenuEvent::CLOSE_MENU";

	constructor(aEventName:string) {
		super(aEventName);
	}
}

export = MenuEvent;