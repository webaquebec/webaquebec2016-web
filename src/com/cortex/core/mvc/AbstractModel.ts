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
 * @author Mathieu 'Sanchez' Cote
 */
import EventDispatcher = require("../event/EventDispatcher");
import LazyLoader = require("../net/LazyLoader");
import MVCEvent = require("./event/MVCEvent");

class AbstractModel extends EventDispatcher {
	
	public mDataCache: any;
	private mJSONData: any;
	/**
	 * @classdesc 	Create the view instance that will load the data file
	 *
	 * @see 		{@link AbstractController}
	 */
	constructor() {
		
		this.mDataCache = {};
		
		super();
	}

	public Fetch(aURL:string, aForceRefresh:boolean = false): void {
		
		if (!aForceRefresh && this.mDataCache[aURL] != null) {
			this.OnJSONLoadSuccess(this.mDataCache[aURL], aURL);
			return;
		}
		
		var promise = LazyLoader.loadJSON(aURL);
		promise.then(() => this.OnJSONLoadSuccess( promise.result, aURL) );
		promise.fail(() => this.OnJSONLoadError(aURL) );
	}

	private GetData(aURL:string): any {
		
		return this.mDataCache[aURL];
	}
	/***
	 *
	 */
	public OnJSONLoadError(aURL:string): void {
		
		console.log( "There was an error loading, ", aURL );
	}
	/***
	 *
	 */
	public OnJSONLoadSuccess( aJSONData:any, aURL:string ): void {
		
		this.mDataCache[aURL] = aJSONData;
		this.DispatchEvent( new MVCEvent( MVCEvent.JSON_LOADED ) );
	}
}

export = AbstractModel;
