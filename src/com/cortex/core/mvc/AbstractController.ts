/***
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
 * @copyright Cortex Media 2015
 *
 * @author Mathieu 'Sanchez' Cote
 */
import EventDispatcher = require("../event/EventDispatcher");
import MVCEvent = require("./event/MVCEvent");
import AbstractModel = require("./AbstractModel");
import AbstractView = require("./AbstractView");
import IDestroyable = require("../garbage/IDestroyable");
/**
 * @classdesc		Create an MVC instance that takes care of several aspect of
 *                  web development like loading a data file and template to be
 *                  instantiated
 */
class AbstractController extends EventDispatcher implements IDestroyable {

	//todo add localization here
	constructor() {
		super();
	}
	
	public Init(aActions:string):void{
		
	}
	
	public Destroy():void{
		
	}
}

export = AbstractController;
