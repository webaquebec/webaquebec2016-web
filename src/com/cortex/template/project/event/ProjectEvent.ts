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

class ProjectEvent extends Event {
	
	static SHOW_PROJECT_CREATION: string = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_CREATION";
	static SHOW_PROJECT_LIST: string = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_LIST";
	static SHOW_PROJECT_EDIT: string = "com.cortex.template.project.event.ProjectEvent::SHOW_PROJECT_EDIT";
	static SHOW_EVALUATION: string = "com.cortex.template.project.event.ProjectEvent::SHOW_EVALUATION";

	constructor(aEventName: string) {
		super(aEventName);
	}
}

export = ProjectEvent;
