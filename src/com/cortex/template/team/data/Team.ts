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

import Department = require("../../department/data/Department");

class Team {
	
	private mID:string;
	private mName:string;
	private mURL:string;
	
	private mDepartmentList:Array<Department>;
	
	constructor() {
		
		this.mDepartmentList = new Array<Department>();
	}
	
	public get ID():string { return this.mID; }
	public set ID(aValue:string) { this.mID = aValue; }
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	public get URL():string { return this.mURL; }
	public set URL(aValue:string) { this.mURL = aValue; }
	
	public get DepartmentList():Array<Department> { return this.mDepartmentList; }
	
	public FromJSON(aData:any):void{
		
		this.ID = aData.route_id;
	}
}

export = Team;
