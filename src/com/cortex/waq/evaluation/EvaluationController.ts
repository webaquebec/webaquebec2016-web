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

import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = require("../../core/mvc/AbstractView");
import DomManipulator = require("../../core/ui/DomManipulator");
import MVCEvent = require("../../core/mvc/event/MVCEvent");

import ListComponent = require("../../core/component/ListComponent");
import ComponentData = require("../../core/component/data/ComponentData");

import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");

import GraphicValidator = require("../../core/ui/GraphicValidator");

import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");

import Evaluation = require("./data/Evaluation");

import ProjectModel = require("../project/ProjectModel");
import ProjectEvent = require("../project/event/ProjectEvent");

import EvaluationModel = require("./EvaluationModel");
import FeatureController = require("./FeatureController");
import Feature = require("./data/Feature");
import Task = require("./data/Task");

import DepartmentModel = require("../department/DepartmentModel");
import Department = require("../department/data/Department");

class EvaluationController extends AbstractController implements INavigable {
	
	private mEvaluationView:AbstractView;
	
	private mEvaluation:Evaluation;
	
	private mFeatureListComponent:ListComponent;
	private mDepartmentListComponent:ListComponent;
	
	private mFeatureControllerList:FeatureController[];
	
	private static mRouteList:Array<string> = ["evaluation"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
		
	public Init(aActions:string):void {
		
		super.Init(aActions);
		
		this.mEvaluationView = new AbstractView();
		this.mEvaluationView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mEvaluationView.LoadTemplate("templates/evaluation/evaluationView.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("evaluationView"));
		
		this.mFeatureListComponent.Destroy();
		this.mFeatureListComponent = null;
		
		this.mEvaluationView.Destroy();
		this.mEvaluationView = null;
	}
	
	public GetRouteList():Array<string>{ return EvaluationController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ):void {
		
		this.mEvaluationView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		this.mEvaluation = new Evaluation();
		
		var baseData:any = {
			
			Client: ProjectModel.GetInstance().SelectedProject.Client,
			Name: ProjectModel.GetInstance().SelectedProject.Name,
			Description: ProjectModel.GetInstance().SelectedProject.Description,
			DepartmentList: DepartmentModel.GetInstance().GetDepartmentList().slice(0,  DepartmentModel.GetInstance().GetDepartmentList().length)
		}
		
		document.getElementById("core").innerHTML += this.mEvaluationView.RenderTemplate(baseData);
		
		this.mFeatureListComponent = new ListComponent();
		this.mFeatureListComponent.Init("featureList");
		
		this.mDepartmentListComponent = new ListComponent();
		this.mDepartmentListComponent.Init("departmentList");
		
		this.mFeatureControllerList = new Array<FeatureController>();
		
		this.mEvaluationView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mEvaluationView.AddClickControl(document.getElementById("addFeature"))
		this.mEvaluationView.AddClickControl(document.getElementById("addDepartment"))
		this.mEvaluationView.AddClickControl(document.getElementById("backToProject"))
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "addFeature"){
			
			this.AddFeature();
		
		} else if(element.id.indexOf("deleteFeature") >= 0) {
			
			this.DeleteFeature(element.id);
			
		} else if(element.id == "addDepartment") {
			
			this.AddDepartment();
			
		} else if(element.id.indexOf("deleteDepartment") >= 0) {
			
			this.DeleteDepartment(element.id);
			
		} else if(element.id == "backToProject") {
			
			this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_EDIT));
		}
	}
	
	private AddDepartment():void {
		
		var departmentSelect:HTMLSelectElement = <HTMLSelectElement>document.getElementById("department");
		
		var departmentName:string = departmentSelect.options[departmentSelect.selectedIndex].text;
		
		var department:Department = DepartmentModel.GetInstance().GetDepartmentByName(departmentName);
		
		var optionListLength:number = departmentSelect.options.length;
		
		for(var i:number = 0; i < optionListLength; i++) {
			
			if(departmentSelect.options[i].text == departmentName){
				
				departmentSelect.options.remove(i);
				break;
			}
		}
		
		this.mEvaluation.DepartmentList.push(department);
		
		var departmentView:AbstractView = new AbstractView();
		
		departmentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
		
		this.mDepartmentListComponent.AddComponent(departmentView, "templates/evaluation/department.html", department, true);
	}
	
	private DeleteDepartment(aElementID:string):void {
		
		var departmentIndex:string = aElementID.split("deleteDepartment")[1];
		
		var departmentComponent:AbstractView = this.mDepartmentListComponent.GetComponentByID(departmentIndex);
		var department:Department = <Department>departmentComponent.Data;
		
		this.ReturnDepartmentOption(department);
		
		var departmentListIndex:number = this.mEvaluation.DepartmentList.indexOf(department);
		
		this.mEvaluation.DepartmentList.splice(departmentListIndex, 1);
		
		var featureControllerListLength:number = this.mFeatureControllerList.length;
		
		for(var i:number = 0; i < featureControllerListLength; i++) {
			
			this.mFeatureControllerList[i].RemoveDepartment(department)		
		}
		
		this.mDepartmentListComponent.RemoveComponent(["department" + departmentIndex], departmentComponent);
	}
	
	private ReturnDepartmentOption(aDepartment:Department):void {
		
		var departmentSelect:HTMLSelectElement = <HTMLSelectElement>document.getElementById("department");
		
		var departmentOption:HTMLOptionElement = <HTMLOptionElement>document.createElement("option");
		
		departmentOption.value = aDepartment.Name;
		departmentOption.text = aDepartment.Name;
		
		departmentSelect.add(departmentOption, Number(aDepartment.ID) + 1);
	}
	
	private AddFeature():void {
		
		var featureView:AbstractView = new AbstractView();
		
		featureView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnFeatureTemplateLoaded, this);
		
		var feature:Feature = new Feature();
		
		this.mEvaluation.FeatureList.push(feature)
		
		this.mFeatureListComponent.AddComponent(featureView, "templates/evaluation/feature.html", feature);
	}
	
	private DeleteFeature(aElementID:string):void {
		
		var featureIndex:string = aElementID.split("deleteFeature")[1];
		
		var featureComponent:AbstractView = this.mFeatureListComponent.GetComponentByID(featureIndex);
		
		var featureListIndex:number = this.mEvaluation.FeatureList.indexOf(featureComponent.Data);
		
		this.mEvaluation.FeatureList.splice(featureListIndex, 1);
		
		this.mFeatureListComponent.RemoveComponent(["feature" + featureIndex, 
													"featureTaskList" + featureIndex, 
													"featureAddTask" + featureIndex], featureComponent);
	}
	
	private OnDepartmentTemplateLoaded(aEvent:MVCEvent):void {
		
		(<AbstractView>aEvent.target).RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
		
		var department:Department = <Department>this.mDepartmentListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		
		var featureControllerListLength:number = this.mFeatureControllerList.length;
		
		for(var i:number = 0; i < featureControllerListLength; i++) {
			
			this.mFeatureControllerList[i].AddDepartment(department)		
		}
		
		this.mEvaluationView.AddClickControl(document.getElementById("deleteDepartment" + department.ID));
	}
	
	private OnFeatureTemplateLoaded(aEvent:MVCEvent):void {
		
		(<AbstractView>aEvent.target).RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnFeatureTemplateLoaded, this);
		
		var feature:Feature = <Feature>this.mFeatureListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		
		var featureController:FeatureController = new FeatureController();
		
		featureController.Init(feature, this.mEvaluationView);
		
		var departmentList:Array<Department> = <Array<Department>>this.mDepartmentListComponent.GetDataList();
		
		var departmentListLength:number = departmentList.length;
		
		for(var i:number = 0; i < departmentListLength; i++) {
			
			featureController.AddDepartment(departmentList[i]);
		}
		
		this.mFeatureControllerList.push(featureController);
		
		this.mEvaluationView.AddClickControl(document.getElementById("deleteFeature" + feature.ID));
	}
}

export = EvaluationController;