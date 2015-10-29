import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import AnimationEvent from "./event/AnimationEvent";

export default class AnimationController extends EventDispatcher {
	
	private static mIdCurrent:string = "content-current";
	private static mIdLoading:string = "content-loading";
	
	private mIndexCurrent:number;
	private mIndexNext:number;
	private mSwipeDirection:number;
	
	private mIsAnimating:boolean;
	
	constructor() {
		super();
		this.Init();
	}
	
	private Init():void {
		this.mIndexCurrent = -1;
		this.mIndexNext = -1;
		this.mSwipeDirection = -1;
		
		this.mIsAnimating = false;
	}
	
	public get IsAnimating():boolean {
		return this.mIsAnimating;
	}
	
	private GetContentLoading():HTMLDivElement {
		return <HTMLDivElement>document.getElementById(AnimationController.mIdLoading);
	}
	
	private GetContentCurrent():HTMLDivElement {
		return <HTMLDivElement>document.getElementById(AnimationController.mIdCurrent);
	}
	
	private SwapContentIds():void {
		var contentLoading:HTMLDivElement = this.GetContentLoading();
		var contentCurrent:HTMLDivElement = this.GetContentCurrent();
		contentLoading.id = AnimationController.mIdCurrent;
		contentCurrent.id = AnimationController.mIdLoading;
	}
	
	public PrepareToAnimateTo(aNext:number):void {
		this.mIndexNext = aNext;
		this.mSwipeDirection = this.mIndexNext - this.mIndexCurrent;
		this.PositionLoaderDiv();
	}
	
	private PositionLoaderDiv():void {
		var contentLoading:HTMLDivElement = this.GetContentLoading();
		if (contentLoading != null) {
			contentLoading.style.transform = this.mSwipeDirection > 0 ? "translateX(100%)" : "translateX(-100%)";
		}
	}
	
	public AnimateContent():void {
		if (this.mIndexCurrent == -1) {
			this.SwapContentIds();
		}
		else {
			window.setTimeout(this.TriggerAnimation.bind(this), 50);
			this.mIsAnimating = true;
		}
		this.mIndexCurrent = this.mIndexNext;
	}
	
	private TriggerAnimation():void {
		var contentCurrent:HTMLDivElement = this.GetContentCurrent();
		var contentLoading:HTMLDivElement = this.GetContentLoading();
		contentCurrent.className = "animated";
		contentLoading.className = "animated";
		contentCurrent.style.transform = this.mSwipeDirection > 0 ? "translateX(-100%)" : "translateX(100%)";
		contentLoading.style.transform = "translateX(0)"
		window.setTimeout(this.FinishControllerTransition.bind(this), 300);
	}
	
	private FinishControllerTransition():void {
		this.DispatchEvent(new AnimationEvent(AnimationEvent.ANIMATION_FINISHED));
		this.mIsAnimating = false;
		var contentCurrent:HTMLDivElement = this.GetContentCurrent();
		var contentLoading:HTMLDivElement = this.GetContentLoading();
		contentCurrent.className = "";
		contentLoading.className = "";
		this.SwapContentIds();
	}
	
}