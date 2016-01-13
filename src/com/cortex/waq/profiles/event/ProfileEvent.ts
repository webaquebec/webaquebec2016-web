import Event from "../../../core/event/Event";

export default class ProfileEvent extends Event {

	static SPEAKERS_LOADED: string = "com.cortex.waq.profile.event.ProfileEvent::SPEAKERS_LOADED";
	static PARTNERS_LOADED: string = "com.waq.cortex.profile.event.ProfileEvent::PARTNERS_LOADED";
	static VOLUNTEERS_LOADED: string = "com.waq.cortex.profile.event.ProfileEvent::VOLUNTEERS_LOADED";

	constructor(aEventName: string) {
		super(aEventName);
	}
}
