import ComponentBinding from "../../core/component/ComponentBinding";
import ListComponent from "../../core/component/ListComponent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import ExploreLocation from "./data/ExploreLocation";
import IExploreNode from "./data/IExploreNode";
import ExploreLocationModel from "./ExploreLocationModel";

export default class ExploreController extends EventDispatcher {

	private mExploreView:AbstractView;
	private mExploreLocationModel:ExploreLocationModel;
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

		this.mExploreLocationModel = new ExploreLocationModel(this.mNodeInfo.pathJson);
		this.mExploreLocationModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnJsonLoaded, this);
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("contact-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mExploreView.Destroy();
		this.mExploreView = null;
	}

	private OnJsonLoaded(aEvent:MVCEvent):void {
		this.mExploreLocationModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJsonLoaded, this);

		this.mExploreView = new AbstractView();
		this.mExploreView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mExploreView.LoadTemplate("templates/explore/explore.html");
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		this.mExploreView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		document.getElementById("contact-locations").innerHTML += this.mExploreView.RenderTemplate(this.mNodeInfo);

		this.mListComponent = new ListComponent();
		this.mListComponent.Init(this.mContainerName);

		this.GenerateListItems();
	}

	private GenerateListItems():void {

		var exploreLocations:Array<ExploreLocation> = this.mExploreLocationModel.GetExploreLocations();

		for (var i:number = 0, iMax:number = exploreLocations.length; i < iMax; i++) {

			exploreLocations[i].ID = "location" + this.mNodeInfo.containerId;

			var componentBinding:ComponentBinding = new ComponentBinding(new AbstractView(), exploreLocations[i]);

			this.mListComponent.AddComponent(componentBinding);
		}

		this.mListComponent.LoadWithTemplate("templates/explore/exploreLocation.html")
	}

}
