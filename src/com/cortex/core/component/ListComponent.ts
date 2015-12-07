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
 * @author Mathieu 'Sanchez' Cote
 */

import AbstractView from "../mvc/AbstractView";
import MVCEvent from "../mvc/event/MVCEvent";
import EventDispatcher from "../event/EventDispatcher";

import ComponentData from "./data/ComponentData";
import ComponentBinding from "./ComponentBinding";
import ComponentEvent from "./event/ComponentEvent";

export default class ListComponent extends EventDispatcher{

	private mComponentBindings:Array<ComponentBinding>;

	private mComponentListHTML:HTMLElement;

	private mComponentCreated:number;

	constructor() {
		super();
	}

	public Init(aComponentListID:string):void{

		this.mComponentBindings = new Array<ComponentBinding>();

		this.mComponentCreated = 0;

		this.mComponentListHTML = <HTMLElement>document.getElementById(aComponentListID);
	}

	public Destroy():void {

		this.mComponentBindings.length = 0;
		this.mComponentBindings = null;

		this.mComponentListHTML = null;
	}

	public get ComponentListHTML():HTMLElement { return(this.mComponentListHTML); }

	public GetComponentBindings():Array<ComponentBinding>{ return this.mComponentBindings; }

	public GetBindingByComponent(aComponent:AbstractView):ComponentBinding{

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			if(this.mComponentBindings[i].View == aComponent){

				return(this.mComponentBindings[i]);
			}
		}

		return(null);
	}

	public AreAllComponentsLoaded():boolean{

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			if(!this.mComponentBindings[i].IsLoaded){

				return(false);
			}
		}

		return(true);
	}

	public GetDataByID(aID:string):ComponentData{

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			if(this.mComponentBindings[i].Data.ID == aID){

				return(this.mComponentBindings[i].Data);
			}
		}

		return(null);
	}

	public GetComponentByData(aData:ComponentData):AbstractView{

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			if(this.mComponentBindings[i].Data == aData){

				return(this.mComponentBindings[i].View);
			}
		}

		return(null);
	}

	public GetComponentByID(aID:string):AbstractView{

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			if(this.mComponentBindings[i].Data.ID == aID){

				return(this.mComponentBindings[i].View);
			}
		}

		return(null);
	}

	public AddComponent(aComponentBinding:ComponentBinding, aKeepID:boolean = false):void{



		if(this.mComponentBindings.indexOf(aComponentBinding) >= 0) {

			if(aComponentBinding.IsRendered){

				aComponentBinding.IsAdded = true;

				this.mComponentListHTML.appendChild(aComponentBinding.HTML);
			}else{
				this.RenderComponents();
			}
			return;
		}

		if(!aKeepID){

			aComponentBinding.Data.ID = this.mComponentCreated.toString();
			this.mComponentCreated++;
		}

		this.mComponentBindings.push(aComponentBinding);
	}

	public RemoveComponent(aComponentBinding:ComponentBinding, aPurge:boolean = false):void{

		if(aPurge){
			this.mComponentBindings.splice(this.mComponentBindings.indexOf(aComponentBinding), 1);
		}

		if(aComponentBinding.IsAdded){
			this.mComponentListHTML.removeChild(aComponentBinding.HTML);
		}

		aComponentBinding.IsAdded = false;
	}

	public RemoveAllComponents(aPurge:boolean = false):void {

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = componentBindingsLength - 1; i >= 0; i--){

			this.RemoveComponent(this.mComponentBindings[i], aPurge);
		}
	}

	public LoadWithTemplate(aTemplate:string = "", aForceReload:boolean = false):void {

		var componentBindingsLength:number = this.mComponentBindings.length;

		for(var i:number = 0; i < componentBindingsLength; i++){

			if(this.mComponentBindings[i].IsLoaded && !aForceReload) { continue; }

			var view:AbstractView = this.mComponentBindings[i].View;

			view.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);

			view.LoadTemplate((this.mComponentBindings[i].Template != null) ? this.mComponentBindings[i].Template : aTemplate);
		}
	}

	private OnComponentTemplateLoaded(aEvent:MVCEvent):void{

		var componentView:AbstractView = <AbstractView>aEvent.target;

		componentView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);

		var componentBinding:ComponentBinding = this.GetBindingByComponent(componentView);

		componentBinding.IsLoaded = true;

		if(!this.AreAllComponentsLoaded()) { return; }

		this.RenderComponents();

		this.DispatchEvent(new ComponentEvent(ComponentEvent.ALL_ITEMS_READY));
	}

	private RenderComponents():void {

		var componentBindingsLength:number = this.mComponentBindings.length;

		for (var i:number = 0; i < componentBindingsLength; i++) {

			var componentBinding:ComponentBinding = this.mComponentBindings[i];

			if(componentBinding.IsRendered) { continue; }

			componentBinding.IsRendered = true;
			componentBinding.IsAdded = true;
			
			this.RenderElement(componentBinding.View.RenderTemplate(componentBinding.Data));
		}
	}

	private RenderElement(aTemplate:string):void {
		this.mComponentListHTML.insertAdjacentHTML("beforeend", aTemplate);
	}
}
