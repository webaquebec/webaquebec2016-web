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

import { LazyLoader } from "cortex-toolkit-js-net";
import EventDispatcher from "../event/EventDispatcher";
import MouseTouchEvent from "../mouse/event/MouseTouchEvent";
import MVCEvent from "./event/MVCEvent";
import IDestroyable from "../garbage/IDestroyable";
import TouchBehavior from "../mouse/TouchBehavior";
import Templating from "../template/Templating";

export default class AbstractView extends EventDispatcher implements IDestroyable {

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

		if (this.mTouchBehavior != null){
			this.mTouchBehavior.Destroy();
		}
		this.mTouchBehavior = null;

		this.mData = null;
		this.mTemplateHTML = null;
	}

	public LoadTemplate(aTemplatePath:string): void {

		var promise = LazyLoader.loadTemplate( aTemplatePath);
		promise.then((result) => { this.OnTemplateLoaded(result); } );
	}

	public set Data(aData:any) { this.mData = aData; }
	public get Data():any { return this.mData; }

	public RenderTemplate(aData:any):string {

		this.Data = aData;

		if(this.mTemplate == "") {

			this.mTemplateHTML = "TEMPLATE IS EMPTY";

		} else {

			this.mTemplateHTML = Templating.Render(this.mTemplate, aData)
		}

		return this.mTemplateHTML;
	}

	public AddClickControl(aElement:HTMLElement):void {

		if(this.mTouchBehavior == null) {

			this.mTouchBehavior = new TouchBehavior();
			this.mTouchBehavior.AddEventListener(MouseTouchEvent.TOUCHED, this.OnTouched, this)
		}

		this.mTouchBehavior.AddClickControl(aElement)
	}

	public RemoveClickControl(aElement:HTMLElement):void {

		this.mTouchBehavior.RemoveClickControl(aElement)
	}

	public get ID(): string { return ( this.mID ); }
	public get Template(): string { return ( this.mTemplate ); }
	public get TemplateHTML(): string { return ( this.mTemplateHTML ); }

	public OnTemplateLoaded( aTemplate:string ): void {

		this.mTemplate = aTemplate;
		this.DispatchEvent( new MVCEvent( MVCEvent.TEMPLATE_LOADED ) );
	}

	private OnTouched(aEvent:MouseTouchEvent):void {

		this.DispatchEvent(aEvent)
	}
}
