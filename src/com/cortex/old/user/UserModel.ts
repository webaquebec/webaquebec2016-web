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

import Logger = require("../../core/debug/Logger");

import DepartmentModel = require("../department/DepartmentModel");
import Department = require("../department/data/Department");

import User = require("./data/User");

class UserModel extends AbstractModel {
	
	private static mInstance:UserModel;
	
	private mUserList:Array<User>;
	
	constructor() {
		
		super();
		
		this.mUserList = new Array<User>();
	}
	
	
	public AddUser(aUser:User):void{
		
		var departmentList:Array<Department> = DepartmentModel.GetInstance().GetDepartmentList();
		var departmentListLength:number = departmentList.length;
		
		for(var i:number = 0; i < departmentListLength; i++){
			
			if(departmentList[i].Name == aUser.Department){
				
				departmentList[i].UserList.push(aUser);
				break;
			}
		}
		
		this.mUserList.push(aUser);
	}
	
	public static GetInstance():UserModel{
		
		if(UserModel.mInstance == null){
			
			UserModel.mInstance = new UserModel();
		}
		
		return UserModel.mInstance;
	}
}

export = UserModel;
