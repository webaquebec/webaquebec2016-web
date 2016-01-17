import AbstractModel from "../../core/mvc/AbstractModel";
import MVCEvent from "../../core/mvc/event/MVCEvent"

import Company from "./data/Company";

import EConfig from "../main/EConfig";
import Spinner from "../spinner/Spinner";

export default class CompanyModel extends AbstractModel {

	private static mInstance:CompanyModel;

	private mCompanies:Array<Company>;

	private mLoaded:boolean = false;

	constructor() {

		super();

		this.mCompanies = [];
	}

	public IsLoaded():boolean { return this.mLoaded; }

	public FetchCompanies():void {

        Spinner.GetInstance().Show();

		this.Fetch(EConfig.BASE_URL + "company?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var company:Company = new Company();
			company.FromJSON(json[i]);
			this.mCompanies.push(company);
		}

		this.mLoaded = true;

        Spinner.GetInstance().Hide();

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetCompanie():Array<Company>{

		return this.mCompanies.slice(0, this.mCompanies.length);
	}

	public GetCompanyByID(aCompanyID:number):Company{

		for(var i:number = 0,  max = this.mCompanies.length; i < max; i++) {

			if(this.mCompanies[i].companyID == aCompanyID){

				return this.mCompanies[i];
			}
		}

		return null;
	}

	public static GetInstance():CompanyModel {

		if(CompanyModel.mInstance == null) {

			CompanyModel.mInstance = new CompanyModel();
		}

		return CompanyModel.mInstance;
	}
}
