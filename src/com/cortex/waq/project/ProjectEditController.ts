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

import AbstractController 		= require("../../core/mvc/AbstractController");
import AbstractView 			= require("../../core/mvc/AbstractView");
import MVCEvent 				= require("../../core/mvc/event/MVCEvent");

import MouseTouchEvent 			= require("../../core/mouse/event/MouseTouchEvent");

import GraphicValidator 		= require("../../core/ui/GraphicValidator");

import NavigationManager 		= require("../../core/navigation/NavigationManager");
import INavigable 				= require("../../core/navigation/INavigable");

import ProjectModel 			= require("./ProjectModel");
import Project 					= require("./data/Project");
import ProjectEvent				= require("./event/ProjectEvent");

class ProjectEditController extends AbstractController implements INavigable {
	
	private mProjectCreationView:AbstractView;
	
	private mClientNameValid:boolean;
	private mProjectNameValid:boolean;
	
	private static mRouteList:Array<string> = ["projectEdit"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
		
	public Init(aActions:string):void{
		
		super.Init(aActions);
		
		this.mProjectCreationView = new AbstractView();
		this.mProjectCreationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProjectCreationView.LoadTemplate("templates/project/projectEditView.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("projectEditView"));
		
		this.mProjectCreationView.Destroy();
		this.mProjectCreationView = null;
	}
	
	public GetRouteList():Array<string>{ return ProjectEditController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		this.mProjectCreationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		document.getElementById("core").innerHTML += this.mProjectCreationView.RenderTemplate(ProjectModel.GetInstance().SelectedProject);
		
		this.mProjectCreationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mProjectCreationView.AddClickControl(document.getElementById("backToProjectList"));
		this.mProjectCreationView.AddClickControl(document.getElementById("addEvaluation"));
	}
	
	private ValidateInput(aInput:HTMLInputElement):boolean {
		
		GraphicValidator.HideInputErrorMessage(aInput.id);	
		
		if(aInput.value == ""){
			
			GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");	
			
			return(false);
		}
		
		return(true);
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "backToProjectList"){
			
			this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST))
			
		} else if(element.id == "addEvaluation") {
			
			this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_EVALUATION));
		}
	}
}

export = ProjectEditController;
