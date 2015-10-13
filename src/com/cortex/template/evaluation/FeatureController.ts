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

import AbstractView = require("../../core/mvc/AbstractView");
import MVCEvent = require("../../core/mvc/event/MVCEvent");

import DomManipulator = require("../../core/ui/DomManipulator");

import EventDispatcher = require("../../core/event/EventDispatcher");

import ListComponent = require("../../core/component/ListComponent");
import ComponentData = require("../../core/component/data/ComponentData");

import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");

import GraphicValidator = require("../../core/ui/GraphicValidator");

import ProjectModel = require("../project/ProjectModel");
import ProjectEvent = require("../project/event/ProjectEvent");

import EvaluationModel = require("./EvaluationModel");
import Feature = require("./data/Feature");
import Task = require("./data/Task");
import Hour = require("./data/Hour");

import Department = require("../department/data/Department");

class FeatureController extends EventDispatcher {
	
	private mFeature:Feature;
	
	private mFeatureView:AbstractView;
	
	private mListComponent:ListComponent;
	
	constructor() {
		
		super();
	}
		
	public Init(aFeature:Feature, aFeatureView:AbstractView):void{
		
		this.mFeature = aFeature;
		this.mFeatureView = aFeatureView;
		
		this.mListComponent = new ListComponent();
		this.mListComponent.Init("taskList" + this.mFeature.ID)
		
		this.mFeatureView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mFeatureView.AddClickControl(document.getElementById("addTask" + this.mFeature.ID));
	}
	
	public Destroy():void {
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mFeatureView.Destroy();
		this.mFeatureView = null;
		
		this.mFeature = null;
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void{
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "addTask" + this.mFeature.ID){
			
			this.AddTask();
			
		} else if(element.id.indexOf("deleteTask" + this.mFeature.ID) >= 0){
			
			this.DeleteTask(element.id);
		}
	}
	
	public AddDepartment(aDepartment:Department):void {
		
		this.mFeature.HourList.push(new Hour(aDepartment.ID, 0));
		
		var featureDepartmentListDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("departmentList" + this.mFeature.ID);
		
		featureDepartmentListDiv.appendChild(this.CreateHourElement("departmentHour" + this.mFeature.ID + "_" + aDepartment.ID))	
		
		var taskListLength:number = this.mFeature.TaskList.length;
		
		for(var i:number = 0; i < taskListLength; ++i) {
			
			var task:Task = this.mFeature.TaskList[i];
			
			task.HourList.push(new Hour(aDepartment.ID, 0));
			
			var taskDepartmentListDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("departmentList" + this.mFeature.ID + "_" + task.ID);
			
			taskDepartmentListDiv.appendChild(this.CreateHourElement("departmentHour" + this.mFeature.ID + "_" + task.ID + "_" + aDepartment.ID));
		}
	}
	
	public RemoveDepartment(aDepartment:Department):void {
		
		var featureHourListLength:number = this.mFeature.HourList.length;
		
		for(var j:number = 0; j < featureHourListLength; ++j){
				
			if(this.mFeature.HourList[j].DepartmentID == aDepartment.ID){
				
				this.mFeature.HourList.splice(j, 1);
				break;
			}
		}
		
		var featureDepartmentListDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("departmentList" + this.mFeature.ID);
		var featureDepartmentHourDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("departmentHourContainer" + this.mFeature.ID + "_" + aDepartment.ID);
		
		featureDepartmentListDiv.removeChild(featureDepartmentHourDiv)	
		
		var taskListLength:number = this.mFeature.TaskList.length;
		
		for(var i:number = 0; i < taskListLength; i++) {
			
			var task:Task = this.mFeature.TaskList[i];
			
			task.HourList.splice(j, 1);
			
			var taskDepartmentListDiv:HTMLDivElement = <HTMLDivElement>document.getElementById("departmentList" + this.mFeature.ID + "_" + task.ID);
			var taskDepartmentHourDiv = <HTMLDivElement>document.getElementById("departmentHourContainer" + this.mFeature.ID + "_" + task.ID + "_" + aDepartment.ID);
			
			taskDepartmentListDiv.removeChild(taskDepartmentHourDiv);
			
			document.getElementById("departmentHour" + task.FeatureID + "_" + task.ID + "_" + aDepartment.ID).removeEventListener("focusout", this.OnTaskFocusOut.bind(this));
		}
	}
	
	private CreateHourElement(aElementID:string):HTMLTableDataCellElement {
		
		var tdElement:HTMLTableDataCellElement = <HTMLTableDataCellElement>document.createElement("td");

		var inputElement:HTMLInputElement = <HTMLInputElement>DomManipulator.CreateElement("input", "0")
		
		inputElement.type = "text";
		inputElement.id = aElementID;
		inputElement.style.width = "100%";
		inputElement.value = "0";
		
		inputElement.addEventListener("focusout", this.OnTaskFocusOut.bind(this));
		
		tdElement.appendChild(inputElement);
		
		return(tdElement);
	}
	
	private AddTask():void{
		
		var taskView:AbstractView = new AbstractView();
		
		taskView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTaskTemplateLoaded, this);
		
		var task:Task = new Task();
		
		task.FeatureID = this.mFeature.ID;
		
		for(var i:number = 0; i < this.mFeature.HourList.length; ++i) {
			
			task.HourList.push(new Hour(this.mFeature.HourList[i].DepartmentID, 0));
		}
		
		this.mFeature.TaskList.push(task);
		
		this.mListComponent.AddComponent(taskView, "templates/evaluation/task.html", task);
	}
	
	private DeleteTask(aElementID:string):void {
		
		var taskIndex:string = aElementID.split("deleteTask" + this.mFeature.ID + "_")[1];
		
		var taskComponent:AbstractView = this.mListComponent.GetComponentByID(taskIndex);
		var task:Task = <Task>this.mListComponent.GetDataByComponent(taskComponent);
		
		this.mFeature.TaskList.splice(this.mFeature.TaskList.indexOf(task))
		
		this.mListComponent.RemoveComponent(["task" + this.mFeature.ID + "_" + taskIndex], this.mListComponent.GetComponentByID(taskIndex));
	}
	
	private OnTaskTemplateLoaded(aEvent:MVCEvent):void{
		
		(<AbstractView>aEvent.target).RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTaskTemplateLoaded, this);
		
		var task:Task = <Task>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		
		this.mFeatureView.AddClickControl(document.getElementById("deleteTask" + this.mFeature.ID + "_" + task.ID));
		
		for(var i:number = 0; i < task.HourList.length; ++i) {
			
			document.getElementById("departmentHour" + task.FeatureID + "_" + task.ID + "_" + task.HourList[i].DepartmentID).addEventListener("focusout", this.OnTaskFocusOut.bind(this));
		}
	}
	
	private OnTaskFocusOut(aEvent:FocusEvent):void {
		
		var input:HTMLInputElement = <HTMLInputElement>aEvent.target;
		
		var inputIDSplitted:string[] = input.id.split("_");
		
		var departmentID:string = inputIDSplitted[2];
		var task:Task = <Task>this.mListComponent.GetDataByID(inputIDSplitted[1]);
		
		for(var j:number = 0; j < task.HourList.length; ++j) {
			
			if(task.HourList[j].DepartmentID == departmentID) {
				
				task.HourList[j].ExecutionTime = input.value == "" ? 0 : Number(input.value);
				break;
			}
		}
		
		var calculatedExecutionTime = 0;
		
		var taskList:Task[] = this.mFeature.TaskList;
		var taskListLength:number = taskList.length;
		
		for(var i:number = 0; i < taskListLength; ++i) {
			
			calculatedExecutionTime += taskList[i].HourList[j].ExecutionTime;	
		}
		
		this.mFeature.HourList[j].ExecutionTime = calculatedExecutionTime;
		
		(<HTMLInputElement>document.getElementById("departmentHour" + task.FeatureID + "_" + departmentID)).value = String(calculatedExecutionTime);
	}
}

export = FeatureController;