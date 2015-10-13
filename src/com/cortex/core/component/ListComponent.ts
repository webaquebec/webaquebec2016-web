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

import AbstractView = require("../mvc/AbstractView");
import MVCEvent = require("../mvc/event/MVCEvent");
import EventDispatcher = require("../event/EventDispatcher");

import ComponentData = require("./data/ComponentData")
import IComponentDataBinding = require("./IComponentDataBinding")

class ListComponent extends EventDispatcher{
	
	private mComponentDataBinding:Array<IComponentDataBinding>;
	
	private mComponentListHTML:HTMLElement;
	
	private mComponentCreated:number;
	
	constructor() {
		super();
	}
		
	public Init(aComponentListID:string):void{
		
		this.mComponentDataBinding = new Array<IComponentDataBinding>();
		
		this.mComponentCreated = 0;
		
		this.mComponentListHTML = <HTMLElement>document.getElementById(aComponentListID);
	}
	
	public Destroy():void {
		
		this.mComponentDataBinding.length = 0;
		this.mComponentDataBinding = null;
		
		this.mComponentListHTML = null;
	}
	
	public get ComponentListHTML():HTMLElement { return(this.mComponentListHTML); }
	
	public GetDataList():Array<ComponentData>{
		
		var dataList:Array<ComponentData> = new Array<ComponentData>();
		
		var componentDataBindingLength:number = this.mComponentDataBinding.length;
		
		for(var i:number = 0; i < componentDataBindingLength; i++){
			
			dataList.push(this.mComponentDataBinding[i].data);		
		}	
		
		return(dataList);
	}
	
	public GetDataByComponent(aComponent:AbstractView):ComponentData{
		
		var componentDataBindingLength:number = this.mComponentDataBinding.length;
		
		for(var i:number = 0; i < componentDataBindingLength; i++){
			
			if(this.mComponentDataBinding[i].component == aComponent){
				
				return(this.mComponentDataBinding[i].data);		
			}	
		}
		
		return(null);
	}
	
	public GetDataByID(aID:string):ComponentData{
		
		var componentDataBindingLength:number = this.mComponentDataBinding.length;
		
		for(var i:number = 0; i < componentDataBindingLength; i++){
			
			if(this.mComponentDataBinding[i].data.ID == aID){
				
				return(this.mComponentDataBinding[i].data);		
			}	
		}
		
		return(null);
	}
	
	public GetComponentByData(aData:ComponentData):AbstractView{
		
		var componentDataBindingLength:number = this.mComponentDataBinding.length;
		
		for(var i:number = 0; i < componentDataBindingLength; i++){
			
			if(this.mComponentDataBinding[i].data == aData){
				
				return(this.mComponentDataBinding[i].component);		
			}	
		}
		
		return(null);
	}
	
	public GetComponentByID(aID:string):AbstractView{
		
		var componentDataBindingLength:number = this.mComponentDataBinding.length;
		
		for(var i:number = 0; i < componentDataBindingLength; i++){
			
			if(this.mComponentDataBinding[i].data.ID == aID){
				
				return(this.mComponentDataBinding[i].component);		
			}	
		}
		
		return(null);
	}
	
	public AddComponent(aComponentView:AbstractView, aTemplate:string, aData:ComponentData, aKeepID:boolean = false):void{
		
		if(!aKeepID){
			
			aData.ID = this.mComponentCreated.toString();
			this.mComponentCreated++;
		}
		
		aComponentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);
		aComponentView.LoadTemplate(aTemplate);
		
		this.mComponentDataBinding.push({component:aComponentView, data:aData});
	}
		
	private OnComponentTemplateLoaded(aEvent:MVCEvent):void{
		
		var componentView:AbstractView = <AbstractView>aEvent.target;
		
		var componentData:ComponentData = this.GetDataByComponent(componentView);
		
		this.mComponentListHTML.insertAdjacentHTML("beforeend", componentView.RenderTemplate(componentData));
	}
	
	public RemoveComponent(aElementIDList:string[], aComponent:AbstractView):void{
		
		var componentDataBindingLength:number = this.mComponentDataBinding.length;
		
		for(var i:number = 0; i < componentDataBindingLength; i++){
			
			if(this.mComponentDataBinding[i].component == aComponent){
				
				break;
			}
		}
		
		this.mComponentDataBinding.splice(i, 1);
		
		for(var j:number = 0; j < aElementIDList.length; j++) {
			
			var componentToRemoveHTML:HTMLElement = document.getElementById(aElementIDList[j]);
			this.mComponentListHTML.removeChild(componentToRemoveHTML);
		}
	}
}

export = ListComponent;
