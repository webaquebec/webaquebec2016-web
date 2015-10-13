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
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu Rhéaume
 */

/**
 * @classdesc Utilitary to run various operations logics across objects
 */
class ObjectExpressions {
	constructor() {
		/*** CONSTRUCTOR GOES HERE **/
	}
	/**
	 * @description     Returns the first object that initially is not undefined or null or empty (String length > 0).
	 *
	 * @param           {any[]} aObjectList - any list of objects that needs to be validated
	 *
	 * @return          {any} if the object matches is not undefined and is not null
	 *
	 * @memberof        com.cortex.core.data.ObjectExpressions
	 */
	public static NVL( aObjectList: Array<any> ): any {

		var objectListLength: number = aObjectList.length;

		var object: any;

		for ( var i: number = 0; i < objectListLength; i++ ) {

			object = aObjectList[i];

			if (object != null ) {

				if ( typeof ( object ) === "string" ) {

					if ( ( <String>object ).trim().length > 0 ) {

						return object;
					}
				} else {
					return object;
				}
			}
		}

		return undefined;
	}
}

export = ObjectExpressions;
