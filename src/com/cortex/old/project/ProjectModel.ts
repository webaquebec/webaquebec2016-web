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
import AbstractModel = require("../../core/mvc/AbstractModel");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import Logger = require("../../core/debug/Logger");

import Project = require("./data/Project");

class ProjectModel extends AbstractModel {
	
	private static mInstance:ProjectModel;
	
	private mProjectList:Array<Project>;
	
	private mSelectedProject:Project;
	
	constructor() {
		
		super();
		
		this.mProjectList = new Array<Project>();
	}
	
	public AddProject(aProject:Project):void{
		
		this.mSelectedProject = aProject;
		
		this.mProjectList.push(aProject);
	}
	
	public GetProjectList():Array<Project> {
		
		return this.mProjectList;
	}
	
	public get SelectedProject():Project { return this.mSelectedProject; }
	public set SelectedProject(aValue:Project) { this.mSelectedProject = aValue; }
	
	public static GetInstance():ProjectModel{
		
		if(ProjectModel.mInstance == null){
			
			ProjectModel.mInstance = new ProjectModel();
		}
		
		return ProjectModel.mInstance;
	}
}

export = ProjectModel;
