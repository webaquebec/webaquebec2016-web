import Event from "../../event/Event";

export default class ComponentEvent extends Event {
	
	static ALL_ITEMS_READY:string = "com.cortex.core.component.event.ComponentEvent::ALL_ITEMS_READY";

	constructor(aEventName:string) {
		super(aEventName);
	}
}