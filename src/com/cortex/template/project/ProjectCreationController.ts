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

class ProjectCreationController extends AbstractController implements INavigable {
	
	private mProjectCreationView:AbstractView;
	
	private mClientNameValid:boolean;
	private mProjectNameValid:boolean;
	
	private static mRouteList:Array<string> = ["projectCreation"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
		
	public Init(aActions:string):void{
		
		super.Init(aActions);
		
		this.mProjectCreationView = new AbstractView();
		this.mProjectCreationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProjectCreationView.LoadTemplate("templates/project/projectCreationView.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("projectCreationView"));
		
		this.mProjectCreationView.Destroy();
		this.mProjectCreationView = null;
	}
	
	public GetRouteList():Array<string>{ return ProjectCreationController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		this.mProjectCreationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		document.getElementById("core").innerHTML += this.mProjectCreationView.RenderTemplate({});
		
		this.mProjectCreationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mProjectCreationView.AddClickControl(document.getElementById("create"));	
		this.mProjectCreationView.AddClickControl(document.getElementById("delete"));	
		
		document.getElementById("clientName").addEventListener("focusout", this.OnClientNameFocusOut.bind(this));
		document.getElementById("projectName").addEventListener("focusout", this.OnProjectNameFocusOut.bind(this));
	}
	
	private ValidateInput(aInput:HTMLInputElement):boolean {
		
		GraphicValidator.HideInputErrorMessage(aInput.id);	
		
		if(aInput.value == ""){
			
			GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");	
			
			return(false);
		}
		
		return(true);
	}
	
	private OnClientNameFocusOut(aEvent:FocusEvent):void {
		
		var input:HTMLInputElement = <HTMLInputElement>aEvent.target;
		
		this.mClientNameValid = this.ValidateInput(input);
	}
	
	private OnProjectNameFocusOut(aEvent:FocusEvent):void {
		
		var input:HTMLInputElement = <HTMLInputElement>aEvent.target;
		
		this.mProjectNameValid = this.ValidateInput(input)
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "create"){
			
			this.CreateProject();
		
		} else if(element.id == "delete") {
			
			this.DeleteProject();
		}
	}
	
	private CreateProject():void {
		
		if(!this.mClientNameValid || !this.mProjectNameValid) { return; }
		
		var project:Project = new Project();
		
		project.Client = (<HTMLInputElement>document.getElementById("clientName")).value;
		project.Name = (<HTMLInputElement>document.getElementById("projectName")).value;
		project.Description = (<HTMLInputElement>document.getElementById("projectDescription")).value;
		
		ProjectModel.GetInstance().AddProject(project)
		
		this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
	}
	
	private DeleteProject():void {
		
		this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST))
	}
}

export = ProjectCreationController;
