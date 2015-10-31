/**
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
 * @copyright    Cortex Media 2015
 *
 * @author Étienne Bergeron-Paquet
 */

import Event from "../../event/Event";

export default class ComponentEvent extends Event {
	
	static ALL_ITEMS_READY:string = "com.cortex.core.component.event.ComponentEvent::ALL_ITEMS_READY";

	constructor(aEventName:string) {
		super(aEventName);
	}
}