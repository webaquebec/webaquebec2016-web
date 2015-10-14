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
import Department = require("../../department/data/Department");

class User extends ComponentData {
	
	private mName:string;
	private mEmail:string;
	private mPassword:string;
	private mPicture:string;
	private mDepartment:string;
	
	constructor() {
		super();
	}
	
	public get Name():string { return this.mName; }
	public set Name(aValue:string) { this.mName = aValue; }
	
	public get Email():string { return this.mEmail; }
	public set Email(aValue:string) { this.mEmail = aValue; }
	
	public get Password():string { return this.mPassword; }
	public set Password(aValue:string) { this.mPassword = aValue; }
	
	public get Picture():string { return this.mPicture; }
	public set Picture(aValue:string) { this.mPicture = aValue; }
	
	public get Department():string { return this.mDepartment; }
	public set Department(aValue:string) { this.mDepartment = aValue; }
}

export = User;
