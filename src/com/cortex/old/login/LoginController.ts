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

import AbstractController = require("../../core/mvc/AbstractController");
import AbstractView = require("../../core/mvc/AbstractView");
import LoginEvent = require("./event/LoginEvent");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");
import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");
import Logger = require("../../core/debug/Logger");

class LoginController extends AbstractController implements INavigable {
	
	private mLoginView:AbstractView;
	
	private static mRouteList:Array<string> = ["", "login"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this);
	}
	
	public Init(aAction:string):void{
				
		this.mLoginView = new AbstractView();
		this.mLoginView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mLoginView.LoadTemplate("templates/login/login.html");
	}
	
	public Destroy():void {
		
		var loginHTMLElement:HTMLElement = document.getElementById("loginView");
		document.getElementById("core").removeChild(loginHTMLElement);
		
		this.mLoginView.Destroy();
		this.mLoginView = null;
	}
	
	public GetRouteList():Array<string>{ return LoginController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		document.getElementById("core").innerHTML += this.mLoginView.RenderTemplate({});
		
		this.mLoginView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		if(document.readyState == "complete" || document.readyState == "interactive"){
			
			this.OnDeviceReady();
			
		} else {
			
			document.addEventListener("deviceready", this.OnDeviceReady.bind(this));
		}
	}
	
	private OnDeviceReady():void{
		
		this.mLoginView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mLoginView.AddClickControl(document.getElementById("connect"));
		this.mLoginView.AddClickControl( document.getElementById("register"));		
	}
	
	private OnScreenClicked(aEvent:MVCEvent):void{
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "connect"){
			
			//DO LOGIN
			
		} else if(element.id == "register"){
			
			this.DispatchEvent(new LoginEvent(LoginEvent.SHOW_TEAM));
		}
		
		console.log(element.id);
	}
}

export = LoginController;
