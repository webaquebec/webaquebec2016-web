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

import IDestroyable = require("../../../core/garbage/IDestroyable");

import ComponentData = require("../../../core/component/data/ComponentData");

import Feature = require("./Feature");
import Department = require("../../department/data/Department");

class Evaluation extends ComponentData implements IDestroyable {
	
	private mClient:string;
	private mProject:string;
	private mName:string;
	private mDescription:string;
	
	private mTotalCost:number;
	
	private mClientCost:number;
	
	private mFeatureList:Array<Feature>;
	
	private mDepartmentList:Array<Department>;
	
	constructor() {
		
		super();
		
		this.mFeatureList = new Array<Feature>();
		this.mDepartmentList = new Array<Department>();
	}
	
	public Destroy():void {
		
		var featureListLength:number = this.mFeatureList.length;
		
		for(var i:number = 0; i < featureListLength; i++){
			
			this.mFeatureList[i].Destroy();
		}
		
		this.mFeatureList.length = 0;
		this.mFeatureList = null;
		
		this.mDepartmentList.length = 0;
		this.mDepartmentList = null;
	}
	
	public get Client():string { return this.mClient; }
	public set Client(aValue:string) { this.mClient = aValue; }
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	public get Description():string { return this.mDescription; }
	public set Description(aValue:string) { this.mDescription = aValue; }
	
	public get FeatureList():Array<Feature> { return this.mFeatureList; }
	public set FeatureList(aValue:Array<Feature>) { this.mFeatureList = aValue; }
	
	public get DepartmentList():Array<Department> { return this.mDepartmentList; }
	public set DepartmentList(aValue:Array<Department>) { this.mDepartmentList = aValue; }
}

export = Evaluation;
