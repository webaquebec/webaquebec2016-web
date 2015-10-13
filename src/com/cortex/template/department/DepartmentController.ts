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

import ListComponent = require("../../core/component/ListComponent");
import ComponentData = require("../../core/component/data/ComponentData");

import DepartmentModel = require("./DepartmentModel");
import Department = require("./data/Department");
import DepartmentEvent = require("./event/DepartmentEvent");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");
import GraphicValidator = require("../../core/ui/GraphicValidator");
import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");
import Logger = require("../../core/debug/Logger");

class DepartmentController extends AbstractController implements INavigable {
	
	private mDepartmentView:AbstractView;
	
	private mListComponent:ListComponent;
	
	private static mRouteList:Array<string> = ["department"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
		
	public Init(aActions:string):void{
		
		super.Init(aActions);
		
		this.mDepartmentView = new AbstractView();
		this.mDepartmentView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mDepartmentView.LoadTemplate("templates/department/departmentView.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("departmentView"));
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mDepartmentView.Destroy();
		this.mDepartmentView = null;
	}
	
	
	public GetRouteList():Array<string>{ return DepartmentController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		document.getElementById("core").innerHTML += this.mDepartmentView.RenderTemplate({});
		
		this.mListComponent = new ListComponent();
		this.mListComponent.Init("departmentList")
		
		this.mDepartmentView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);;
		
		this.mDepartmentView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mDepartmentView.AddClickControl(document.getElementById("addDepartment"));	
		this.mDepartmentView.AddClickControl(document.getElementById("createDepartment"));	
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void{
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "addDepartment"){
			
			this.AddDepartment();
		
		}else if(element.id.indexOf("delete") >= 0){
			
			this.DeleteDepartment(element.id);
		
		}else if(element.id == "createDepartment"){
			
			this.CreateDepartmentList();
		}
	}
	
	private CreateDepartmentList():void{
		
		var departmentList:Array<ComponentData> = this.mListComponent.GetDataList();
		
		var departmentListLength:number = departmentList.length;
		
		for(var i:number = 0; i < departmentListLength; i++){
			
			var department:Department = <Department>departmentList[i];
			
			if(department.Name == "") { return; }
		}
		
		for(var i:number = 0; i < departmentListLength; i++){
			
			DepartmentModel.GetInstance().AddDepartment(<Department>departmentList[i]);
		}
		
		this.DispatchEvent(new DepartmentEvent(DepartmentEvent.SHOW_USER))
	}
	
	private AddDepartment():void{
		
		var department:AbstractView = new AbstractView();
		
		department.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnDepartmentTemplateLoaded, this);
		
		this.mListComponent.AddComponent(department, "templates/department/department.html", new Department());
	}
	
	private DeleteDepartment(aElementID:string):void{
		
		var departmentIndex:string = aElementID.split("delete")[1];
			
		this.mListComponent.RemoveComponent(["department" + departmentIndex], this.mListComponent.GetComponentByID(departmentIndex));
	}
	
	private OnDepartmentTemplateLoaded(aEvent:MVCEvent):void{
		
		var department:Department = <Department>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		
		this.mDepartmentView.AddClickControl(document.getElementById("delete" + department.ID));
		
		document.getElementById("input"+ department.ID).addEventListener("focusout", this.OnDepartmentInputFocusOut.bind(this));	
	}
	
	private OnDepartmentInputFocusOut(aEvent:FocusEvent):void{
		
		var input:HTMLInputElement = <HTMLInputElement>aEvent.target;
		
		GraphicValidator.HideInputErrorMessage(input.id);	
		
		var departmentID:string = input.id.split("input")[1];
		
		var department:Department = <Department>this.mListComponent.GetDataByID(departmentID);
				
		if(input.value == ""){
			
			GraphicValidator.ShowInputErrorMessage(input.id, "input cannot be empty");	
			
		}else{
			
			department.Name = input.value;
		}
	}
}

export = DepartmentController;