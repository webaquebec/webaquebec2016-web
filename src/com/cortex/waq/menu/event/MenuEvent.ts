import Event from "../../../core/event/Event";

export default class MenuEvent extends Event {
	
	static SHOW_MENU: string = "com.cortex.waq.menu.event.MenuEvent::SHOW_MENU";
	static CLOSE_MENU: string = "com.cortex.waq.menu.event.MenuEvent::CLOSE_MENU";
	static ITEMS_READY: string = "com.cortex.waq.menu.event.MenuEvent::ITEMS_READY";

	constructor(aEventName:string) {
		super(aEventName);
	}
}