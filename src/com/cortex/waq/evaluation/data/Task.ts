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

import Hour = require("./Hour");

class Task extends ComponentData {
	
	private mName:string;
	private mFeatureID:string;
	private mDescription:string;
	private mEvaluate:boolean;
	private mRisk:number = 0;
	private mQuantity:number = 0;
	
	private mHourList:Array<Hour>;
	
	constructor() {
		
		super();
		
		this.mHourList = new Array<Hour>();
	}
	
	public Destroy():void {
		
		this.mHourList.length = 0;
		this.mHourList = null;
	}
	
	public get FeatureID():string { return this.mFeatureID; }
	public set FeatureID(aValue:string) { this.mFeatureID = aValue; }
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	public get Description():string { return this.mDescription; }
	public set Description(aValue:string) { this.mDescription = aValue; }
	
	public get Evaluate():boolean { return this.mEvaluate; }
	public set Evaluate(aValue:boolean) { this.mEvaluate = aValue; }
	
	public get Risk():number { return this.mRisk; }
	public set Risk(aValue:number) { this.mRisk = aValue; }
	
	public get Quantity():number { return this.mQuantity; }
	public set Quantity(aValue:number) { this.mQuantity = aValue; }
	
	public get HourList():Array<Hour> { return this.mHourList; }
}

export = Task;
