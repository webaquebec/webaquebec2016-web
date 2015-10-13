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
 
/// <reference path="../../../../../definitions/blueimp-tmpl/tmpl.d.ts" />
/* /// <reference path="../../../../../definitions/touch.d.ts" /> */

import LazyLoader = require("../net/LazyLoader");
import Logger = require("../debug/Logger");
import EventDispatcher = require("../event/EventDispatcher");
import MouseTouchEvent = require("../mouse/event/MouseTouchEvent");
import MVCEvent = require("./event/MVCEvent");
import IDestroyable = require("../garbage/IDestroyable");
import TouchBehavior = require("../mouse/TouchBehavior");
import Point = require("../geom/Point");

class AbstractView extends EventDispatcher implements IDestroyable {
	
	private mID:string;
	
	private mData:any;
	
	private mTemplate: string;
	private mTemplateHTML: string;
	
	private mTouchBehavior:TouchBehavior;
	
	constructor(aID:string = "") {
		
		super();
		
		this.mID = aID;
	}
	
	public Destroy() : void {
		
		this.mTouchBehavior.Destroy();
		this.mTouchBehavior = null;
		
		this.mData = null;
		this.mTemplateHTML = null;
	}
	
	public LoadTemplate(aTemplatePath:string): void {
		
		var promise = LazyLoader.loadTemplate( aTemplatePath);
		promise.then(() => this.OnTemplateLoaded( promise.result ) );
	}
	
	public set Data(aData:any) { this.mData = aData; }
	public get Data():any { return this.mData; }
	
	public RenderTemplate(aData:any):string {
		
		this.Data = aData;
		
		if(this.mTemplate == "") { 
			
			this.mTemplateHTML = "TEMPLATE IS EMPTY"; 
			
		} else {
			
			this.mTemplateHTML = tmpl(this.mTemplate, aData)
		}
		
		return this.mTemplateHTML;
	}
	
	public AddClickControl(aElement:HTMLElement):void {
		
		if(this.mTouchBehavior == null) {
			
			this.mTouchBehavior = new TouchBehavior();
		}
		
		this.mTouchBehavior.AddClickControl(aElement)
		this.mTouchBehavior.AddEventListener(MouseTouchEvent.TOUCHED, this.OnTouched, this)
	}
	
	public RemoveClickControl(aElement:HTMLElement):void {
		
		this.mTouchBehavior.RemoveClickControl(aElement)
	}
	
	public get ID(): string { return ( this.mID ); }
	public get Template(): string { return ( this.mTemplate ); }
	public get TemplateHTML(): string { return ( this.mTemplateHTML ); }
	
	public OnTemplateLoaded( aTemplate ): void {
		
		this.mTemplate = aTemplate;
		this.DispatchEvent( new MVCEvent( MVCEvent.TEMPLATE_LOADED ) );
	}
	
	private OnTouched(aEvent:MouseTouchEvent):void {
		
		this.DispatchEvent(aEvent)	
	}
}

export = AbstractView;
