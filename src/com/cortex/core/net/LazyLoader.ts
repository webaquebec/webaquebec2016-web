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
 * @copyright Cortex Media 2015
 *
 * @author Mathieu Rhéaume
 */

import P = require("../../promise/promise");

/**
 * @classdesc Provides a simple way to use Promise with XHR Callback
 */
class LazyLoader {
    /**
     * @memberof com.cortex.core.net.LazyLoader
     * @param {string} aFile - Path of the file to fetch
     * @param {string} aApiToken - Token to add in Autorization header if used in beaver token
     * @param {object} aDatastoreObject - A Datastore object to cache the XHR Response.
     */
    public static loadJSON(aFile: string, aApiToken?: string, aDatastoreObject?: any): P.Promise<any> {
        var deferObject = P.defer<any>();

        if (aDatastoreObject != null && aDatastoreObject.get(aFile) != null) {
            deferObject.resolve(aDatastoreObject.get(aFile));
        } else {
            //<Review> this should be a function
            //<Review> Might want to wrap the request in something custom as you do a lot
            // of treatement that similar in all three functions
            var xhr = new XMLHttpRequest();
            //</Review>
            xhr.open("GET", aFile, true);
            try {
                xhr.responseType = "json";
            } catch (e) {
                // WebKit added support for the json responseType value on 09/03/2013
                // https://bugs.webkit.org/show_bug.cgi?id=73648. Versions of Safari prior to 7 are
                // known to throw when setting the value "json" as the response type. Other older
                // browsers implementing the responseType
                //
                // The json response type can be ignored if not supported, because JSON payloads are
                // parsed on the client-side regardless.
                if (xhr.responseType !== "json" && xhr.responseText !== "json") {
					// doesnt work with android 4.0.x
                    // throw e;
                }
            }

            if (aApiToken !== undefined && aApiToken.length > 0) {
                xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
            }

            xhr.onerror = function(error:Event) {
                deferObject.reject(<any>error);
            };
            xhr.onload = function() {
                if (xhr.response !== null) {
                    var objToReturn;
                    if (typeof(xhr.response) === "string") {
                        objToReturn = JSON.parse(xhr.response);
                    } else {
                        objToReturn = xhr.response;
                    }

                    if (aDatastoreObject !== undefined) { // Store it if we have to cache it !!!
                        aDatastoreObject.set(aFile, objToReturn);
                    }

                    deferObject.resolve(objToReturn);
                } else {
                    deferObject.reject(new Error("No valid JSON object was found (" +
                                xhr.status + " " + xhr.statusText + ")"));
                }
            };
            xhr.send();
        }

        return deferObject.promise();
    }

    /**
     * @memberof com.cortex.core.net.LazyLoader
     * @param {string} aFile - Path of the file to fetch
     */
    public static loadFile(aFile: string): P.Promise<any> {
        var deferObject = P.defer<any>(),
        xhr = new XMLHttpRequest();
        xhr.open("GET", aFile, true);
        xhr.onerror = function(error) {
            deferObject.reject(<any>error);
        };

        xhr.onload = function() {
            if (xhr.response !== null) {
                var objToReturn;
                if (typeof(xhr.response) === "string") {
                    objToReturn = JSON.parse(xhr.response);
                } else {
                    objToReturn = xhr.response;
                }
                deferObject.resolve(objToReturn);
            } else {
                deferObject.reject(new Error("No valid JSON object was found (" +
                            xhr.status + " " + xhr.statusText + ")"));
            }

        };
        xhr.send();
        return deferObject.promise();
    }

    /**
     * @memberof com.cortex.core.net.LazyLoader
     * @param {string} aFile - Path of the file to fetch
     */
    public static loadTemplate(aFile: string): P.Promise<any> {
        var deferObject = P.defer<any>(),
        xhr = new XMLHttpRequest();
        xhr.open("GET", aFile, true);
        xhr.onerror = function(error) {
            deferObject.reject(<any>error);
        };

        xhr.onload = function() {
            if (xhr.response !== null) {
                deferObject.resolve(xhr.response);
            } else {
                deferObject.reject(new Error("No valid JSON object was found (" +
                            xhr.status + " " + xhr.statusText + ")"));
            }

        };
        xhr.send();
        return deferObject.promise();
    }


    /**
     * @memberof com.cortex.core.net.LazyLoader
     * @param {string} aFile - Path of the file to fetch
     * @param {object} aJsonObject - Json object to send
     * @param {boolean} aSyncOrNot - Execute the request in sync or async mode.
     * @param {string} aApiToken - Token to use in autorization header.
     */
    public static sendJSON(aFile: string, aJsonObject: any, aSyncOrNot?: boolean, aApiToken?: any): P.Promise<any> {
        var deferObject = P.defer<any>(),
        xhr = this.getXHRObject("POST", aFile, aSyncOrNot, aApiToken);

        xhr.onerror = function(error) {
            deferObject.reject(<any>error);
        };

        xhr.onload = function() {
            LazyLoader.handleXHRReponse(xhr, deferObject);
        };

        xhr.send (JSON.stringify(aJsonObject));
        return deferObject.promise();
    }

    /**
     * Realise a PUT (UPDATE) Operation from a provided Json Object.
     *
     * @memberof com.cortex.core.net.LazyLoader
     * @param {string} aFile - Path of the file to fetch
     * @param {any} aJsonObject - JSON Object to send.
     * @param {boolean} aSyncOrNot - Execute the request in sync or async mode.
     * @param {string} aApiToken - Token to use in autorization header.
     */
    public static updateJSON(aFile: string,
            aJsonObject: any,
            aSyncOrNot?: boolean,
            aApiToken?: any): P.Promise<any> {
        var deferObject: P.Deferred<any> = P.defer<any>(),
        xhr = this.getXHRObject("PUT", aFile, aSyncOrNot, aApiToken);

        xhr.onerror = function(error) {
            deferObject.reject(<any>error);
        };

        xhr.onload = function() {
            LazyLoader.handleXHRReponse(xhr, deferObject);
        };

        xhr.send (JSON.stringify(aJsonObject));
        return deferObject.promise();
    }

    public static deleteRequest(aFile: string,
            aJsonObject: any,
            aSyncOrNot?: boolean,
            aApiToken?: any): P.Promise<any> {
        var deferObject: P.Deferred<any> = P.defer<any>();
        var xhr = this.getXHRObject("DELETE", aFile, aSyncOrNot, aApiToken);
        xhr.onerror = function(error) {
            deferObject.reject(<any>error);
        };

        xhr.onload = function() {
            deferObject.resolve(xhr.status);
        };

        xhr.send();
        return deferObject.promise();
    }


    /**
     * Handles callback from XHR Query and Parse the JSON from query...
     *
     * @memberof com.cortex.core.net.LazyLoader
     * @param {XMLHttpRequest} aXhrObject - Object used to do the query
     * @param {Defer} aDeferObject - Object from promise your currently running...
     */
    public static handleXHRReponse(requestObject: XMLHttpRequest,
            aDeferObject: any): any {
        var requestResponse = requestObject.response;
        if (requestResponse !== null) {
            var objToReturn: any;
            if (typeof(requestResponse) === "string" && requestResponse !== "") {
                objToReturn = JSON.parse(requestResponse);
            } else {
                objToReturn = requestResponse;
            }
            aDeferObject.resolve(objToReturn);
        } else {
            aDeferObject.reject(new Error("No valid JSON object was found (" +
                        requestObject.status + " " + requestObject.statusText + ")"));
        }
    }

    /**
     * Initialize a XMLHttpRequest object with the required headers for a JSON Object Operation
     *
     * @memberof com.cortex.core.net.LazyLoader
     * @param {string} aHttpOperation - HTTP Operation to do
     * @param {string} aFile - Path of the file to fetch
     * @param {boolean} aSyncOrNot - Execute the request in sync or async mode.
     * @param {string} aApiToken - Token to use in autorization header.
     */
    private static getXHRObject (aHttpOperation: string, aFile: string, aSyncOrNot?: boolean, aApiToken?: string): XMLHttpRequest {
        var xhr = new XMLHttpRequest;
        xhr.open(aHttpOperation, aFile, aSyncOrNot);

        if (aApiToken !== undefined && aApiToken.length > 0) {
            xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
        }

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        return xhr;
    }
}

export = LazyLoader;
