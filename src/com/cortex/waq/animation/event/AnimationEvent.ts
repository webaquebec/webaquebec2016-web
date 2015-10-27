import Event from "../../../core/event/Event";

export default class AnimationEvent extends Event {
	
	static ANIMATION_FINISHED: string = "com.cortex.waq.animation.event.AnimationEvent::ANIMATION_FINISHED";

	constructor(aEventName:string) {
		super(aEventName);
	}
}