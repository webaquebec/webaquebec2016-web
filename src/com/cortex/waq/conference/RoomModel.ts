import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import Room from "./data/Room";

import EConfig from "../main/EConfig";

export default class RoomModel extends AbstractModel {

	private static mInstance:RoomModel;

	private mRooms:Array<Room>;

	private mDataLoaded:boolean = false;

	constructor() {

		super();

		this.mRooms = [];
	}

	public IsLoaded():boolean { return this.mDataLoaded; }

	public FetchRooms():void {

		this.Fetch(EConfig.BASE_URL + "room?per_page=" + EConfig.PER_PAGE);
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<any> = aJSONData;

		var totalItems:number = json.length;

		for (var i:number = 0; i < totalItems; i++) {

			var room:Room = new Room();

			room.FromJSON(json[i]);

			this.mRooms.push(room);
		}

		this.mDataLoaded = true;

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetRoomByID(aRoomID:number):Room {

		for(var i:number = 0, max = this.mRooms.length; i < max; i++) {

			if(this.mRooms[i].roomID == aRoomID){

				return this.mRooms[i];
			}
		}

		return null;
	}

	public GetRooms():Array<Room> {

		return this.mRooms;
	}

	public static GetInstance():RoomModel {

		if(RoomModel.mInstance == null) {

			RoomModel.mInstance = new RoomModel();
		}

		return RoomModel.mInstance;
	}
}
