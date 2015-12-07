/*
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
import ComponentData from "./data/ComponentData";
import AbstractView from "../mvc/AbstractView";

export default class ComponentBinding {

	private mView:AbstractView;
	private mData:ComponentData;
	private mTemplate:string;
	private mHTML:HTMLElement;

	private mIsLoaded:boolean = false;
	private mIsRendered:boolean = false;
	private mIsAdded:boolean = false;

	public constructor(aView:AbstractView, aData:ComponentData, aTemplate:string = null){

		this.mView = aView;
		this.mData = aData;
		this.mTemplate = aTemplate;
	}

	public get View():AbstractView { return this.mView; }
	public set View(aValue:AbstractView) { this.mView = aValue; }

	public get Data():ComponentData { return this.mData; }
	public set Data(aValue:ComponentData) { this.mData = aValue; }

	public get Template():string { return this.mTemplate; }
	public set Template(aValue:string) { this.mTemplate = aValue; }

	public get HTML():HTMLElement { return this.mHTML; }
	public set HTML(aValue:HTMLElement) { this.mHTML = aValue; }

	public get IsLoaded():boolean { return this.mIsLoaded; }
	public set IsLoaded(aValue:boolean) { this.mIsLoaded = aValue; }

	public get IsRendered():boolean { return this.mIsRendered; }
	public set IsRendered(aValue:boolean) { this.mIsRendered = aValue; }

	public get IsAdded():boolean { return this.mIsAdded; }
	public set IsAdded(aValue:boolean) { this.mIsAdded = aValue; }
}
