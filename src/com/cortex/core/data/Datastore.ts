/****
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
 * @author Mathieu Rhéaume
 */

/**
  * @classdesc Provides a aKey aValue storage that lives duing a browser sessions cycle.
  */
class Datastore {
    private mDatastore: any;
    private JSON_OBJECT_TYPE: string = "object";
/**
  * @constructor
  */
    constructor() {
        this.mDatastore = {};
    }

/**
  * @memberof com.cortex.core.data.Datastore
  * @param {string} aKey - Index to get the value
  * @param {boolean} aWithoutSessionStorage - Don't lookup in session storage for this aKey
  */
    public get(aKey: string, aWithoutSessionStorage?): any{
        if (this.mDatastore[aKey]) {
            return this.mDatastore[aKey];
        } else {
            if (typeof(sessionStorage) !== "undefined" && !aWithoutSessionStorage) {
                try {
                    var objToReturn = JSON.parse(sessionStorage.getItem(aKey));
                    if (objToReturn  && typeof objToReturn  === this.JSON_OBJECT_TYPE && objToReturn !== null) {
                        return JSON.parse(sessionStorage.getItem(aKey));
                    } else {
                        return objToReturn;
                    }
                } catch ( e ) {
                    return sessionStorage.getItem(aKey);
                }
            } else {
                return undefined;
            }
        }
    }

/**
  * @memberof com.cortex.core.data.Datastore
  * @param {string} aKey - Index to get the value
  * @param {any} aValue - Value to store.
  * @param {boolean} aWithoutSessionStorage - Don't lookup in session storage for this aKey
  */
    public set(aKey: string, aValue: any, aWithoutSessionStorage?) {
        this.mDatastore[aKey] = aValue;
        if (typeof(sessionStorage) !== "undefined" && !aWithoutSessionStorage) {
            if (typeof(sessionStorage) === this.JSON_OBJECT_TYPE) {
                sessionStorage.setItem(aKey, JSON.stringify(aValue));
            } else {
                sessionStorage.setItem(aKey, aValue);
            }
        }
    }
}

export = Datastore;
