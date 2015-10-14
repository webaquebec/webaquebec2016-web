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

import Logger 					= require("../../core/debug/Logger");

import ListComponent 			= require("../../core/component/ListComponent");
import ComponentData 			= require("../../core/component/data/ComponentData");
import IComponentDataBinding 	= require("../../core/component/IComponentDataBinding");

import Project					= require("./data/Project");
import ProjectEvent				= require("./event/ProjectEvent");
import ProjectModel				= require("./ProjectModel");

class ProjectListController extends AbstractController implements INavigable {
	
	private mProjectView:AbstractView;
	
	private mListComponent:ListComponent;
	
	private static mRouteList:Array<string> = ["project"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
		
	public Init(aActions:string):void{
		
		super.Init(aActions);
		
		this.mProjectView = new AbstractView();
		this.mProjectView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProjectView.LoadTemplate("templates/project/projectListView.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("projectListView"));
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mProjectView.Destroy();
		this.mProjectView = null;
	}
	
	public GetRouteList():Array<string>{ return ProjectListController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		this.mProjectView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		document.getElementById("core").innerHTML += this.mProjectView.RenderTemplate({});
		
		this.mListComponent = new ListComponent();
		this.mListComponent.Init("projectList");
		
		this.mProjectView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mProjectView.AddClickControl(document.getElementById("addProject"));
		
		this.GenerateProjectList();
	}
	
	private GenerateProjectList():void {
		
		var projectList:Array<Project> = ProjectModel.GetInstance().GetProjectList();
		var projectListLength:number = projectList.length;
		
		for(var i:number = 0; i < projectListLength; i++) {
			
			var project:AbstractView = new AbstractView();
			
			project.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnProjectTemplateLoaded, this);
			
			this.mListComponent.AddComponent(project, "templates/project/project.html", projectList[i]);
		}
	}
	
	private OnProjectTemplateLoaded(aEvent:MVCEvent):void {
		
		var project:Project = <Project>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		
		this.mProjectView.AddClickControl(document.getElementById("edit" + project.ID));
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "addProject"){
			
			this.AddProject();
		
		} else if(element.id.indexOf("edit") >= 0) {
			
			var projectID:string = element.id.split("edit")[1];
				
			ProjectModel.GetInstance().SelectedProject = <Project>this.mListComponent.GetDataByID(projectID);
			
			this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
		}
	}
	
	private AddProject():void{
		
		this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_CREATION));
	}
}

export = ProjectListController;
