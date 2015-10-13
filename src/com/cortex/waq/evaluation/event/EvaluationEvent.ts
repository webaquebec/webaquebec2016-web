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

import Event = require("../../../core/event/Event");

class EvaluationEvent extends Event {
	
	static SHOW_USER: string = "com.cortex.template.evaluation.event.EvaluationEvent::SHOW_USER";

	constructor(aEventName: string) {
		super(aEventName);
	}
}

export = EvaluationEvent;
