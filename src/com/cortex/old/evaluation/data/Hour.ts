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
 
import ComponentData = require("../../../core/component/data/ComponentData");

class Hour extends ComponentData {
	
	private mDepartmentID:string;
	private mExecutionTime:number;
	
	constructor(aDepartmentID:string, aExecutionTime:number) {
		super();
		
		this.mDepartmentID = aDepartmentID;
		this.mExecutionTime = aExecutionTime
	}
	
	public get DepartmentID():string { return this.mDepartmentID; }
	public set DepartmentID(aValue:string) { this.mDepartmentID = aValue; }
	
	public get ExecutionTime():number { return this.mExecutionTime; }
	public set ExecutionTime(aValue:number) { this.mExecutionTime = aValue; }
}

export = Hour;
