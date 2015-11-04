import Event from "../../../core/event/Event";

export default class SwipeEvent extends Event {
	
	static SWIPE_LEFT: string = "com.cortex.waq.swipe.event.SwipeEvent::SWIPE_LEFT";
	static SWIPE_RIGHT: string = "com.cortex.waq.swipe.event.SwipeEvent::SWIPE_RIGHT";

	constructor(aEventName:string) {
		super(aEventName);
	}
}