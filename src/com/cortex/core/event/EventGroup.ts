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

import Event = require("./Event");
import IDestroyable = require("../garbage/IDestroyable");
/**
 * @classdesc 		Manage all callback and firing of events
 */
class EventGroup implements IDestroyable {

	private mCallbackList: Array<any>;
	/**
	 * @constructor
	 */
	constructor() {

		this.mCallbackList = new Array<any>();
	}
	/***
	 *
	 */
	public Destroy(): void {

		this.mCallbackList.splice(0, this.mCallbackList.length);

		this.mCallbackList = null;
	}
	/**
	 * @description		Push a new callback inside the mCallbackList
	 *
	 * @param			{Function} aCallback - the function to be executed
	 * @param			{any} aScope - the scope associated with the aCallback parameter
	 *
	 * @memberof 		com.cortex.core.event.EventGroup
	 */
	public Add(aCallback: Function, aScope: any): void {

		this.mCallbackList.push({
                                    callback: aCallback,
                                    scope: aScope
                                });
	}
	/**
	 * @description 	Splice a given callback via indexes
	 *
	 * @param 			{number} aIndex - The callback index to be spliced
	 *
	 * @memberof 		com.cortex.core.event.EventGroup
	 */
	public Remove(aIndex: number): void {

		this.mCallbackList.splice(aIndex, 1);
	}
	/**
	 * @description		Retreive the index of a callback/scope combination
	 *
	 * @param			{Function} aCallback - the function to be executed
	 * @param			{any} aScope - the scope associated with the aCallback parameter
	 *
	 * @return			{number} the index of the callback/scope combination
	 *
	 * @memberof 		com.cortex.core.event.EventGroup
	 */
	public Find(aCallback: Function, aScope: any): number {

		var index: number = -1;

		var callbackListLength: number = this.mCallbackList.length;

		for (var i: number = 0; i < callbackListLength; i++) {

			var callbackObject: any = this.mCallbackList[i];

			if ("" + callbackObject.callback === "" + aCallback && callbackObject.scope === aScope) {

				index = i;
				break;
			}
		}
		return(index);
	}
	/**
	 * @description 	Return whether a callback/scope exist using the Find function
	 *
	 * @param			{Function} aCallback - the function to be executed
	 * @param			{any} aScope - the scope associated with the aCallback parameter
	 *
	 * @return			{boolean} true if the callback and scope exist
	 *
	 * @memberof 		com.cortex.core.event.EventGroup
	 */
	public Exist(aCallback: Function, aScope: any): boolean {

		return(this.Find(aCallback, aScope) >= 0);
	}
	/**
	 * @description 	Return if this.mCallbackList is empty
	 *
	 * @return 			{boolean} true if the list length is equal to 0
	 *
	 * @memberof 		com.cortex.core.event.EventGroup
	 */
	public Empty(): boolean { return(this.mCallbackList.length <= 0); }
	/**
	 * @description		For all callback registered call the function passing the aEvent as reference
	 *
	 * @param 			{Event} aEvent - The event that will be passed to all callback
	 *
	 * @memberof 		com.cortex.core.event.EventGroup
	 */
	public FireEvent(aEvent: Event): void {

		var callbackListLength: number = this.mCallbackList == null ? 0 : this.mCallbackList.length;

		for (var i: number = callbackListLength - 1; i >= 0 ; i--) {

			this.mCallbackList[i].callback.apply(this.mCallbackList[i].scope, [aEvent]);
		}
	}
}

export = EventGroup;
