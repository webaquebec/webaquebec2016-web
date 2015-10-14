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

import Evaluation = require("../../evaluation/data/Evaluation");

class Project extends ComponentData implements IDestroyable {
	
	private mClient:string;
	private mName:string;
	private mDescription:string;
	private mURL:string;
	
	private mEvaluationList:Array<Evaluation>;
	
	constructor() {
		
		super();
		
		this.mEvaluationList = new Array<Evaluation>();
	}
	
	public Destroy():void {
		
		var evaluationListLength:number = this.mEvaluationList.length;
		
		for(var i:number = 0; i < evaluationListLength; i++){
			
			this.mEvaluationList[i].Destroy();
		}
		
		this.mEvaluationList.length = 0;
		this.mEvaluationList = null;
	}
	
	public get Client():string { return this.mClient; }
	public set Client(aValue:string) { this.mClient = aValue; }
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	public get Description():string { return this.mDescription; }
	public set Description(aValue:string) { this.mDescription = aValue; }
	
	public get URL():string { return this.mURL; }
	public set URL(aValue:string) { this.mURL = aValue; }
	
	public get EvaluationList():Array<Evaluation> { return this.mEvaluationList; }
	public set EvaluationList(aValue:Array<Evaluation>) { this.mEvaluationList = aValue; }
}

export = Project;
