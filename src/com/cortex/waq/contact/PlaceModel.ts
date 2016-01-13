import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Place from "./data/Place";
import Spinner from "../spinner/Spinner";

import EConfig from "../main/EConfig";

export default class PlaceModel extends AbstractModel {

	private static mInstance:PlaceModel;

	private mPlaces:Array<Place>;

	private mDataLoaded:boolean = false;

	constructor() {

		super();

		this.mPlaces = [];
	}

	public IsLoaded():boolean { return this.mDataLoaded; }

	public FetchPlaces():void {

        Spinner.GetInstance().Show();

		this.Fetch(EConfig.BASE_URL + "place?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var place:Place = new Place();
			place.FromJSON(json[i]);
			this.mPlaces.push(place);

		}

        Spinner.GetInstance().Hide();

		this.mDataLoaded = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetPlaceByID(aPlaceID:number):Place {

		for(var i:number = 0, max = this.mPlaces.length; i < max; i++){
			if(this.mPlaces[i].placeID == aPlaceID){
				return(this.mPlaces[i]);
			}
		}
		return null;
	}

	public GetPlaceByType(aType:string):Array<Place> {

		var placeByTypes:Array<Place> = [];

		for(var i:number = 0, max = this.mPlaces.length; i < max; i++){

			if(this.mPlaces[i].type == aType){
				
				placeByTypes.push(this.mPlaces[i]);
			}
		}
		return placeByTypes;
	}

	public GetPlaces():Array<Place> {
		return this.mPlaces.slice(0, this.mPlaces.length);
	}

	public static GetInstance():PlaceModel {

		if(PlaceModel.mInstance == null) {

			PlaceModel.mInstance = new PlaceModel();
		}

		return PlaceModel.mInstance;
	}
}
