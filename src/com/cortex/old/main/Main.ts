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

/// <reference path="../../../../../definitions/routie/routie.d.ts" />

/*
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import AbstractController = require("../../core/mvc/AbstractController");

import KeyManager = require("../../core/key/KeyManager");
import IKeyBindable = require("../../core/key/IKeyBindable");
import NavigationManager = require("../../core/navigation/NavigationManager");

import TeamController = require("../team/TeamController");
import TeamEvent = require("../team/event/TeamEvent");

import ProjectListController = require("../project/ProjectListController");
import ProjectCreationController = require("../project/ProjectCreationController");
import ProjectEditController = require("../project/ProjectEditController");
import ProjectEvent = require("../project/event/ProjectEvent");

import DepartmentController = require("../department/DepartmentController");
import DepartmentEvent = require("../department/event/DepartmentEvent");

import EvaluationController = require("../evaluation/EvaluationController");
import EvaluationEvent = require("../evaluation/event/EvaluationEvent");

import LoginController = require("../login/LoginController");
import LoginEvent = require("../login/event/LoginEvent");

import UserController = require("../user/UserController");
import UserEvent = require("../user/event/UserEvent");

class Main implements IKeyBindable {
	
	private mLastActions: string;
	
	private mLastController:AbstractController;
	
	constructor() {
		
		this.Init();
	}

	public Init(): void {

		this.SetupRouting();
		
		KeyManager.Register(this);
	}

	public KeyPressed(aKeyList:Array<number>):void{
		
		if(aKeyList.indexOf(192) >= 0){
			
			var outputStyle:CSSStyleDeclaration = document.getElementById("output").style;
			
			outputStyle.visibility = outputStyle.visibility == "hidden" ? "visible" : "hidden";
		}
		
		console.log(aKeyList);
	}
	
	private SetupRouting():void{
		
		routie("", this.ShowLoginScreen.bind( this ) );
	}
	
	private ShowLoginScreen():void{
		
		this.SetupNavigable("login", LoginController);
		
		this.mLastController.AddEventListener(LoginEvent.SHOW_TEAM, this.OnShowTeamScreen, this);
	}
	
	private OnShowTeamScreen(aEvent:LoginEvent):void{
		
		<TeamController>(aEvent.target).RemoveEventListener(LoginEvent.SHOW_TEAM, this.OnShowTeamScreen, this);
		
		this.ShowTeamScreen();
	}
	
	private ShowTeamScreen():void{
		
		this.SetupNavigable("team", TeamController);
		
		this.mLastController.AddEventListener(TeamEvent.SHOW_DEPARTMENT, this.OnShowDepartmentScreen, this);
	}
	
	private OnShowDepartmentScreen(aEvent:TeamEvent):void{
		
		<TeamController>(aEvent.target).RemoveEventListener(TeamEvent.SHOW_DEPARTMENT, this.OnShowDepartmentScreen, this);
		
		this.ShowDepartmentScreen();
	}
	
	private ShowDepartmentScreen():void{
		
		this.SetupNavigable("department", DepartmentController);
		
		this.mLastController.AddEventListener(DepartmentEvent.SHOW_USER, this.OnShowUserScreen, this);
	}
	
	private OnShowUserScreen(aEvent:DepartmentEvent):void{
		
		<TeamController>(aEvent.target).RemoveEventListener(DepartmentEvent.SHOW_USER, this.OnShowUserScreen, this);
		
		this.ShowUserScreen();
	}
	
	private ShowUserScreen():void{
		
		this.SetupNavigable("user", UserController);
		
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
	}
	
	private OnShowProjectListScreen(aEvent:DepartmentEvent):void{
		
		this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
		
		this.ShowProjectListScreen();
	}
	
	private ShowProjectListScreen():void{
		
		this.SetupNavigable("projectList", ProjectListController);
		
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_CREATION, this.OnShowProjectCreationScreen, this);
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
	}
	
	private OnShowProjectCreationScreen(aEvent:ProjectEvent):void{
				
		this.SetupNavigable("projectCreation", ProjectCreationController);
		
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
	}
	
	private OnShowProjectEditScreen(aEvent:ProjectEvent) {
		
		this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
		this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
		
		this.SetupNavigable("projectEdit", ProjectEditController);
		
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
		this.mLastController.AddEventListener(ProjectEvent.SHOW_EVALUATION, this.OnShowEvaluationScreen, this)
	}
	
	private OnShowEvaluationScreen(aEvent:ProjectEvent):void {
					
		this.mLastController.RemoveEventListener(ProjectEvent.SHOW_PROJECT_LIST, this.OnShowProjectListScreen, this);
		this.mLastController.RemoveEventListener(ProjectEvent.SHOW_EVALUATION, this.OnShowEvaluationScreen, this);		
		
		this.SetupNavigable("evaluation", EvaluationController);
		
		this.mLastController.AddEventListener(ProjectEvent.SHOW_PROJECT_EDIT, this.OnShowProjectEditScreen, this);
	}
	
	private SetupNavigable(aName:string, aControllerClass:any):void {
		
		if(NavigationManager.NavigateTo(aName) == null) {
			
			this.mLastController = this.LoadNavigation(aName, new aControllerClass());
			
		} else {
			
			this.mLastController = this.LoadNavigation(aName);
		}
	}
	
	private LoadNavigation( aActions: string, aForceController:AbstractController = null): AbstractController {
		
		aActions = ( aActions == null ) ? "" : aActions;

		this.mLastActions = aActions;
		
		if(this.mLastController != null){
			
			this.mLastController.Destroy();
		}
		
		this.mLastController = (aForceController != null) ? aForceController : <AbstractController><any>NavigationManager.NavigateTo( aActions.split( "/" )[0] );

		this.mLastController.Init(aActions );
		
		return this.mLastController;
	}
}

export = Main;
*/