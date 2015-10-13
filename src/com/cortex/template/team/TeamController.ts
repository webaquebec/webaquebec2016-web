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
import TeamModel = require("./TeamModel");
import TeamEvent = require("./event/TeamEvent");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import MouseTouchEvent = require("../../core/mouse/event/MouseTouchEvent");
import GraphicValidator = require("../../core/ui/GraphicValidator");
import NavigationManager = require("../../core/navigation/NavigationManager");
import INavigable = require("../../core/navigation/INavigable");
import ERegexPattern = require("../../core/regex/ERegexPattern");
import Logger = require("../../core/debug/Logger");

class TeamController extends AbstractController implements INavigable {
	
	private mTeamView:AbstractView;

	private mTeamInput:HTMLInputElement;
	
	private static mRouteList:Array<string> = ["team"];
	
	constructor() {
		
		super();
		
		NavigationManager.Register(this)
	}
		
	public Init(aActions:string):void{
		
		super.Init(aActions);
		
		this.mTeamView = new AbstractView();
		this.mTeamView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mTeamView.LoadTemplate("templates/team/team.html");
	}
	
	public Destroy():void {
		
		document.getElementById("core").removeChild(document.getElementById("teamView"));
		
		this.mTeamInput = null;
		
		this.mTeamView.Destroy();
		this.mTeamView = null;
	}
	
	public GetRouteList():Array<string>{ return TeamController.mRouteList; }
	
	private OnTemplateLoaded( aEvent: MVCEvent ): void {
		
		document.getElementById("core").innerHTML += this.mTeamView.RenderTemplate({});
		
		this.mTeamView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		
		this.mTeamInput = <HTMLInputElement>document.getElementById("teamName");
		this.mTeamInput.addEventListener("focusout", this.OnTeamNameFocusOut.bind(this));
		
		this.mTeamView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		
		this.mTeamView.AddClickControl(document.getElementById("createAccount"));	
	}
	
	
	private OnTeamNameFocusOut(aEvent:FocusEvent):void{
		
		GraphicValidator.HideInputErrorMessage("teamName");
		
		var teamName:string = this.mTeamInput.value;
		
		if(teamName == ""){
			
			GraphicValidator.ShowInputErrorMessage("teamName", "team name cannot be empty");
		
		}else if(TeamModel.GetInstance().ValidateTeamName(teamName)){
			
			GraphicValidator.ShowInputErrorMessage("teamName", "team name is already taken");
		}
	}
	
	private OnScreenClicked(aEvent:MouseTouchEvent):void{
		
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;
		
		if(element.id == "createAccount"){
			
			TeamModel.GetInstance().CreateTeam(this.mTeamInput.value);
			
			this.DispatchEvent(new TeamEvent(TeamEvent.SHOW_DEPARTMENT));
		}
	}
}

export = TeamController;
