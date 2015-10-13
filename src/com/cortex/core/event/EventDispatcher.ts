/***
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

import IDestroyable = require("../garbage/IDestroyable");
import Event = require("./Event");
import EventGroup = require("./EventGroup");

/**
 * @classdesc 		Recreate an event base system without having to be a dom object
 */
class EventDispatcher implements IDestroyable {

	private mListenerDictionary: { [eventName: string]: EventGroup };
	/**
     * @constructor
	 */
	constructor() {

		this.mListenerDictionary = {};
	}
	/***
	 *
	 **/
	public Destroy() {

		this.mListenerDictionary = undefined;
	}
	/**
	 * @description		Valide is an event has been added to a 
	 *
	 * @param			{string} aEventName - The name of the event to be added. As a best pratice don't hardcode the string, use an enumaration
	 *
     * @memberof 		com.cortex.core.event.EventDispatcher
	 */
	public HasEventListener(aEventName: string):boolean {
		
		return(this.mListenerDictionary[aEventName] != null);
	}
	/**
	 * @description		Add an event to be listened to inside a hashmap that keep track of what is and isn't already there
	 *
	 * @param			{string} aEventName - The name of the event to be added. As a best pratice don't hardcode the string, use an enumaration
	 * @param			{Function} aCallback - The function to be executed when the event is triggered
	 * @param			{any} aScope - The scope of the aCallback parameter
	 *
     * @memberof 		com.cortex.core.event.EventDispatcher
	 */
	public AddEventListener(aEventName: string, aCallback: Function, aScope: any): void {

		if (this.mListenerDictionary[aEventName] == null) {

			this.mListenerDictionary[aEventName] = new EventGroup();
		}

		if (!this.mListenerDictionary[aEventName].Exist(aCallback, aScope)) {

			this.mListenerDictionary[aEventName].Add(aCallback, aScope);
		}
	}
	/**
	 * @description		Remove an event to be listened to from the hashmap
	 *
	 * @param			{string} aEventName - The name of the event to be removed. As a best pratice don't hardcode the string, use an enumaration
	 * @param			{Function} aCallback - The function that was registered by the AddEventListener function
	 * @param			{any} aScope - The scope of the aCallback parameter
	 *
	 * @memberof 		com.cortex.core.event.EventDispatcher
	 */
	public RemoveEventListener(aEventName: string, aCallback: Function, aScope: any): void {

		if(!this.HasEventListener(aEventName)) { return; }
		
		var callbackIndex: number = this.mListenerDictionary[aEventName].Find(aCallback, aScope);

		if (callbackIndex >= 0) {

			this.mListenerDictionary[aEventName].Remove(callbackIndex);
		}

		if (this.mListenerDictionary[aEventName].Empty()) {

			this.mListenerDictionary[aEventName].Destroy();
			this.mListenerDictionary[aEventName] = undefined;
		}
	}
	/**
	 * @description		Trigger a particular event so that everything that registered to it can have a notification.
	 *
	 * @param 			{Event} aEvent - The event to be triggered
	 *
	 * @memberof 		com.cortex.core.event.EventDispatcher
	 */
	public DispatchEvent(aEvent: Event): void {

		if (this.mListenerDictionary[aEvent.eventName] != null) {

			aEvent.target = this;

			this.mListenerDictionary[aEvent.eventName].FireEvent(aEvent);
		}
	}
}

export = EventDispatcher;
