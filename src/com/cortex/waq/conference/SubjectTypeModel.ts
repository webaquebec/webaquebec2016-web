import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import SubjectType from "./data/SubjectType";

import EConfig from "../main/EConfig";

export default class SubjectTypeModel extends AbstractModel {

	private static mInstance:SubjectTypeModel;

	private mSubjectTypes:Array<SubjectType>;

	private mDataLoaded:boolean = false;

	constructor() {

		super();

		this.mSubjectTypes = [];
	}

	public IsLoaded():boolean { return this.mDataLoaded; }

	public FetchSubjectTypes():void {

		this.Fetch(EConfig.BASE_URL + "track?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<any> = aJSONData;

		var totalItems:number = json.length;

		json.sort(function(ob1, ob2){ return ob1.title.rendered.localeCompare(ob2.title.rendered) });

		for (var i:number = 0; i < totalItems; i++) {

			var subjectType:SubjectType = new SubjectType();

			subjectType.FromJSON(json[i]);

			this.mSubjectTypes.push(subjectType);
		}

		this.mDataLoaded = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetSubjectTypeByID(aSubjecTypeID:number):SubjectType {

		for(var i:number = 0, max = this.mSubjectTypes.length; i < max; i++) {

			if(this.mSubjectTypes[i].subjectTypeID == aSubjecTypeID){

				return this.mSubjectTypes[i];
			}
		}

		return null;
	}

	public GetSubjectTypes():Array<SubjectType> {

		return this.mSubjectTypes;
	}

	public static GetInstance():SubjectTypeModel {

		if(SubjectTypeModel.mInstance == null) {

			SubjectTypeModel.mInstance = new SubjectTypeModel();
		}

		return SubjectTypeModel.mInstance;
	}
}
