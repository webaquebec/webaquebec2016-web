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

import Task = require("./Task");

class Feature extends Task implements IDestroyable {
	
	private mTaskList:Array<Task>;
	
	constructor() {
		
		super();
		
		this.mTaskList = new Array<Task>();
	}
	
	public Destroy():void {
		
		var taskListLength:number = this.mTaskList.length;
		
		for(var i:number = 0; i < taskListLength; i++) {
			
			this.mTaskList[i].Destroy();
		}
		
		this.mTaskList.length = 0;
		this.mTaskList = null;	
	}
	
	public get TaskList():Array<Task> { return this.mTaskList; }
	public set TaskList(aValue:Array<Task>) { this.mTaskList = aValue; }
}

export = Feature;
