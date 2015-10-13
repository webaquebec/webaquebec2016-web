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
import AbstractModel = require("../../core/mvc/AbstractModel");
import MVCEvent = require("../../core/mvc/event/MVCEvent");
import Logger = require("../../core/debug/Logger");
import Team = require("./data/Team");

class TeamModel extends AbstractModel {
	
	private static mInstance:TeamModel;
	
	private mTeam:Team;
	
	constructor() {
		
		super();
	}
	
	public CreateTeam(aTeamName:string):void{
		
		this.mTeam = new Team();
		
		this.mTeam.Name = aTeamName;
	}
	
	public GetTeam():Team { return this.mTeam; }
	
	public ValidateTeamName(aTeamName:string):boolean{
		
		// validate team name on server
		
		return(false);
	}
	
	public static GetInstance():TeamModel{
		
		if(TeamModel.mInstance == null){
			
			TeamModel.mInstance = new TeamModel();
		}
		
		return TeamModel.mInstance;
	}
}

export = TeamModel;
