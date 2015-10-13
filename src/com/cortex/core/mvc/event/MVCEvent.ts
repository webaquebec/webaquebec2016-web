/******
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
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */

import Event = require("../../event/Event");

class MVCEvent extends Event {
	
	static TEMPLATE_LOADED: string = "com.cortex.core.mvc.event.MVCEvent::TEMPLATE_LOADED";
	static JSON_LOADED: string = "com.cortex.core.mvc.event.MVCEvent::JSON_LOADED";

	/******
	 *
	 */
	constructor(aEventName: string) {
		super(aEventName);
	}
}

export = MVCEvent;
