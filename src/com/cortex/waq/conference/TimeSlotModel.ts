import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import TimeSlot from "./data/TimeSlot";

import EConfig from "../main/EConfig";

export default class TimeSlotModel extends AbstractModel {

	private static mInstance:TimeSlotModel;

	private mTimeSlots:Array<TimeSlot>;

	private mDataLoaded:boolean = false;

	constructor() {

		super();

		this.mTimeSlots = [];
	}

	public IsLoaded():boolean { return this.mDataLoaded; }

	public FetchTimeSlots():void {

		this.Fetch(EConfig.BASE_URL + "time_slot?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<any> = aJSONData;

		var totalItems:number = json.length;

		for (var i:number = 0; i < totalItems; i++) {

			var timeSlot:TimeSlot = new TimeSlot();

			timeSlot.FromJSON(json[i]);

			this.mTimeSlots.push(timeSlot);
		}

		this.mDataLoaded = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetTimeSlotByID(aTimeSlotID:number):TimeSlot {

		for(var i:number = 0, max = this.mTimeSlots.length; i < max; i++) {

			if(this.mTimeSlots[i].timeSlotID == aTimeSlotID){

				return this.mTimeSlots[i];
			}
		}

		return null;
	}

	public GetTimeSlots():Array<TimeSlot> {

		return this.mTimeSlots;
	}

	public static GetInstance():TimeSlotModel {

		if(TimeSlotModel.mInstance == null) {

			TimeSlotModel.mInstance = new TimeSlotModel();
		}

		return TimeSlotModel.mInstance;
	}
}
