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
import Department = require("./data/Department");
import TeamModel = require("../team/TeamModel");


class DepartmentModel extends AbstractModel {
	
	private static mInstance:DepartmentModel;
	
	constructor() {
		
		super();
	}
	
	public CreateDepartment(aDepartmentName:string):void{
		
		var department:Department = new Department();
		
		department.Name = aDepartmentName;
		
		this.AddDepartment(department);
	}
	
	public AddDepartment(aDepartment:Department):void{
		
		TeamModel.GetInstance().GetTeam().DepartmentList.push(aDepartment);
	}
	
	public GetDepartmentList():Array<Department>{
		
		return TeamModel.GetInstance().GetTeam().DepartmentList;
	}
	
	public GetDepartmentByName(aDepartmentName:string):Department {
		
		var departmentList:Array<Department> = this.GetDepartmentList();
		
		for(var i:number = 0; i < departmentList.length; i++) {
			
			if(departmentList[i].Name == aDepartmentName) {
				
				return(departmentList[i]);
			}
		}
		
		return(null);
	}
	
	public static GetInstance():DepartmentModel{
		
		if(DepartmentModel.mInstance == null){
			
			DepartmentModel.mInstance = new DepartmentModel();
		}
		
		return DepartmentModel.mInstance;
	}
}

export = DepartmentModel;
