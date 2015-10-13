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

import UserModel 				= require("./UserModel");
import User 					= require("./data/User");
import UserEvent				= require("./event/UserEvent");
import ProjectEvent				= require("../project/event/ProjectEvent");

import ListComponent 			= require("../../core/component/ListComponent");
import ComponentData 			= require("../../core/component/data/ComponentData");
import IComponentDataBinding 	= require("../../core/component/IComponentDataBinding");

import DepartmentModel 			= require("../department/DepartmentModel");

class UserController extends AbstractController implements INavigable {
	
	private mUserView:AbstractView;
	
	private mListComponent:ListComponent;
	
	private static mRouteList:Array<string> = ["user"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
		
	public Init(aActions:string):void{
		
		super.Init(aActions);
		
		this.mUserView = new AbstractView();
		this.mUserView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mUserView.LoadTemplate("templates/user/userView.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("userView"));
		
		this.mListComponent.Destroy();
		this.mListComponent = null;
		
		this.mUserView.Destroy();
		this.mUserView = null;
	}
	
	public GetRouteList():Array<string>{ return UserController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		this.mUserView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		document.getElementById("core").innerHTML += this.mUserView.RenderTemplate({});
		
		this.mListComponent = new ListComponent();
		this.mListComponent.Init("userList");
		
		this.mUserView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mUserView.AddClickControl(document.getElementById("addUser"));	
		this.mUserView.AddClickControl(document.getElementById("createUsers"));	
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "addUser"){
			
			this.AddUser();
		
		} else if(element.id.indexOf("delete") >= 0) {
			
			this.DeleteUser(element.id);
		
		} else if(element.id == "createUsers") {
			
			this.CreateUserList();
		}
	}
	
	private CreateUserList():void{
		
		var userList:Array<ComponentData> = this.mListComponent.GetDataList();
		
		var userListListLength:number = userList.length;
		
		var i:number;
		var user:User;
		
		for(i = 0 ; i < userListListLength; i++){
			
			user = <User>userList[i]["user"];
			
			if(user.Name == "" || user.Email == "") { return; }
		}
		
		for(i = 0 ; i < userListListLength; i++){
			
			user = <User>userList[i]["user"];
			
			UserModel.GetInstance().AddUser(user);
		}
		
		this.DispatchEvent(new ProjectEvent(ProjectEvent.SHOW_PROJECT_LIST))
	}
	
	private AddUser():void{
		
		var user:AbstractView = new AbstractView();
		
		user.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnUserTemplateLoaded, this);
		
		var data:ComponentData = new ComponentData();
		
		data["user"] = new User();
		data["departments"] = DepartmentModel.GetInstance().GetDepartmentList();
		
		this.mListComponent.AddComponent(user, "templates/user/user.html", data);
	}
		
	private OnUserTemplateLoaded(aEvent:MVCEvent):void{
		
		var user:User = <User>this.mListComponent.GetDataByComponent(<AbstractView>aEvent.target);
		
		this.mUserView.AddClickControl(document.getElementById("delete" + user.ID));
		
		document.getElementById("name" + user.ID).addEventListener("focusout", this.OnUserNameInputFocusOut.bind(this));
		document.getElementById("email" + user.ID).addEventListener("focusout", this.OnUserEmailInputFocusOut.bind(this));
	}
	
	private DeleteUser(aElementID:string):void{
		
		var userIndex:string = aElementID.split("delete")[1];
		
		this.mListComponent.RemoveComponent(["user" + userIndex], this.mListComponent.GetComponentByID(userIndex));
	}
	
	private ValidateInput(aInput:HTMLInputElement):boolean {
		
		GraphicValidator.HideInputErrorMessage(aInput.id);	
		
		if(aInput.value == ""){
			
			GraphicValidator.ShowInputErrorMessage(aInput.id, aInput.id + " cannot be empty");	
			
			return(false);
		}
		
		return(true);
	}
	
	private OnUserNameInputFocusOut(aEvent:FocusEvent):void{
		
		var input:HTMLInputElement = <HTMLInputElement>aEvent.target;
		
		if(this.ValidateInput(input)) {
			
			var userID:string = input.id.split("name")[1];
		
			var user:User = <User>this.mListComponent.GetDataByID(userID);
		
			user.Name = input.value;
		}
	}
	
	private OnUserEmailInputFocusOut(aEvent:FocusEvent):void {
		
		var input:HTMLInputElement = <HTMLInputElement>aEvent.target;
		
		if(this.ValidateInput(input)) {
			
			var userID:string = input.id.split("email")[1];
		
			var user:User = <User>this.mListComponent.GetDataByID(userID);
		
			user.Email = input.value;
		}
	}
}

export = UserController;
