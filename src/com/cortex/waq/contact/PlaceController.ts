import ComponentBinding from "../../core/component/ComponentBinding";
import ListComponent from "../../core/component/ListComponent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import Place from "./data/Place";
import IExploreNode from "./data/IExploreNode";
import PlaceModel from "./PlaceModel";

export default class PlaceController extends EventDispatcher {

	private mPlaceView:AbstractView;
	private mPlaceModel:PlaceModel;
	private mNodeInfo:IExploreNode;

	private mContainerName:string;
	private mListComponent:ListComponent;

	private mTemplateReady:boolean;
	private mJsonReady:boolean;

	constructor(aNodeInfo:IExploreNode) {

		super();

		this.mNodeInfo = aNodeInfo;

		this.Init();
	}

	public Init():void {

		this.mTemplateReady = false;
		this.mJsonReady = false;

		this.mContainerName = "explore-container" + this.mNodeInfo.containerId;

		this.mPlaceModel = PlaceModel.GetInstance();

		this.mPlaceView = new AbstractView();
		this.mPlaceView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mPlaceView.LoadTemplate("templates/explore/explore.html");
	}

	public Destroy():void {

		var scheduleHTMLElement:HTMLElement = document.getElementById("contact-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mPlaceView.Destroy();
		this.mPlaceView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		this.mPlaceView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		document.getElementById("contact-locations").insertAdjacentHTML("beforeend", this.mPlaceView.RenderTemplate(this.mNodeInfo));

		this.GenerateListItems();
	}

	private GenerateListItems():void {

		this.mListComponent = new ListComponent();
		this.mListComponent.Init(this.mContainerName);

		var places:Array<Place> = this.mPlaceModel.GetPlaceByType(this.mNodeInfo.type);

		for (var i:number = 0, iMax:number = places.length; i < iMax; i++) {

			places[i].ID = this.mNodeInfo.name + this.mNodeInfo.containerId;

			var componentBinding:ComponentBinding = new ComponentBinding(new AbstractView(), places[i]);

			this.mListComponent.AddComponent(componentBinding, true);
		}

		this.mListComponent.LoadWithTemplate("templates/explore/exploreLocation.html")
	}

}
