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

import Evaluation = require("./data/Evaluation");

class EvaluationModel extends AbstractModel {
	
	private static mInstance:EvaluationModel;
	
	private mEvaluationList:Array<Evaluation>;
	
	
	constructor() {
		
		super();
		
		this.mEvaluationList = new Array<Evaluation>();
	}
	
	public AddEvaluation(aEvaluation:Evaluation):void{
		
		this.mEvaluationList.push(aEvaluation);
	}
	
	public GetEvaluationList():Array<Evaluation> {
		
		return this.mEvaluationList;
	}
	
	public static GetInstance():EvaluationModel{
		
		if(EvaluationModel.mInstance == null){
			
			EvaluationModel.mInstance = new EvaluationModel();
		}
		
		return EvaluationModel.mInstance;
	}
}

export = EvaluationModel;
