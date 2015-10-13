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

import User = require("../../user/data/User");

import ComportentData = require("../../../core/component/data/ComponentData");

class Department extends ComportentData {
	
	private mName:string;
	private mHourlyRate:number;
	
	private mUserList:Array<User>;
	
	constructor() {
		
		super();
		
		this.mUserList = new Array<User>();
	}
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	public get HourlyRate():number { return this.mHourlyRate; }
	public set HourlyRate(aValue:number) { this.mHourlyRate = aValue; }
	
	public get UserList():Array<User> { return this.mUserList; }
}

export = Department;
