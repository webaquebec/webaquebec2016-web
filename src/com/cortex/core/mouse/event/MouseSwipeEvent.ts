/*
 * All information contained herein is, and remains
 * the property of Cortex Media and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Cortex Media and its suppliers
 * and may be covered by Canada and Foreign Patents,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Cortex Media.
 *
 * @copyright Cortex Media 2015
 *
 * @author Étienne Bergeron-Paquet
 */

import Event from "../../event/Event";

export default class MouseSwipeEvent extends Event {

	static SWIPE_BEGIN:string = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_BEGIN";
	static SWIPE_MOVE:string = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_MOVE";
	static SWIPE_END:string = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_END";

	static SWIPE_LEFT:string = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_LEFT";
	static SWIPE_RIGHT:string = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_RIGHT";

	constructor(aEventName:string) {
		super(aEventName);
	}

}
