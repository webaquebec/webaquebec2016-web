import ComponentData from "../../../core/component/data/ComponentData";

export default class MenuItem extends ComponentData {

	private mName:string;
	private mOrder:number;
	private mAction:string;
	private mController:string;

	constructor() {
		super();
	}

	public get name():string { return this.mName; }
	public set name(aName:string) { this.mName = aName; }

	public get order():number { return this.mOrder; }
	public set order(aOrder:number) { this.mOrder = aOrder; }

	public get action():string { return this.mAction; }
	public set action(aAction:string) { this.mAction = aAction; }

	public get controller():string { return this.mController; }
	public set controller(aController:string) { this.mController = aController; }

	public FromJSON(aData:any):void {
		this.mName = aData.name;
		this.mOrder = aData.order;
		this.mAction = aData.action;
		this.mController = aData.controller;
	}

}
