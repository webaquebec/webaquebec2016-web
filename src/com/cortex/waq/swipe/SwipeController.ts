import EventDispatcher from "../../core/event/EventDispatcher";

import MouseSwipeEvent from "../../core/mouse/event/MouseSwipeEvent";
import TouchBehavior from "../../core/mouse/TouchBehavior";
import Mouse from "../../core/mouse/Mouse";

export default class SwipeController extends EventDispatcher {

	private static SWIPE_SENSIBILITY:number = 40;
	private static SWIPE_TIME_OUT:number = 500;

	private mTouchBehavior:TouchBehavior;

	private mIsSwiping:boolean;

	private mSwipeStartX:number;
	private mTimeStart:number;

	constructor() {
		super();
		this.mIsSwiping = false;
		Mouse.Start();
	}

	public InitOnElement(aElementId:string):void {
		var element:HTMLElement = document.getElementById(aElementId);
		this.mTouchBehavior = new TouchBehavior();
		this.mTouchBehavior.AddClickControl(element);
		this.mTouchBehavior.AddEventListener(MouseSwipeEvent.SWIPE_BEGIN, this.OnMouseSwipeEvent, this);
		this.mTouchBehavior.AddEventListener(MouseSwipeEvent.SWIPE_MOVE, this.OnMouseSwipeEvent, this);
		this.mTouchBehavior.AddEventListener(MouseSwipeEvent.SWIPE_END, this.OnMouseSwipeEvent, this);
	}

	public OnMouseSwipeEvent(aEvent:MouseSwipeEvent):void {
		switch (aEvent.eventName) {
			case MouseSwipeEvent.SWIPE_BEGIN:
			this.HandleSwipeBegin(aEvent);
			break;

			case MouseSwipeEvent.SWIPE_MOVE:
			this.HandleSwipeMove(aEvent);
			break;

			default:
			case MouseSwipeEvent.SWIPE_END:
			this.HandleSwipeEnd();
			break;
		}
	}

	private HandleSwipeBegin(aEvent:MouseSwipeEvent):void {

		if (this.mIsSwiping) { return };

		this.mIsSwiping = true;
		this.mSwipeStartX = aEvent.locationX;
		this.mTimeStart = new Date().getTime();
	}

	private HandleSwipeMove(aEvent:MouseSwipeEvent):void {

		if (!this.mIsSwiping) { return };

		var currentTime:number = new Date().getTime();
		var difference = currentTime - this.mTimeStart;
		if (difference > SwipeController.SWIPE_TIME_OUT) {
			this.HandleSwipeEnd();
			return;
		}
		var mouseX:number = aEvent.locationX;
		var diffX:number = this.mSwipeStartX - mouseX;
		this.mSwipeStartX = mouseX;

		if (Math.abs(diffX) >= SwipeController.SWIPE_SENSIBILITY) {
			var direction:string = diffX < 0 ?
				MouseSwipeEvent.SWIPE_LEFT :
				MouseSwipeEvent.SWIPE_RIGHT;
            document.getElementById("content-current").classList.add("is-showingSpinner");
            document.getElementById("content-loading").classList.add("is-showingSpinner");
            document.getElementById("background-dim").style.display="block";
			this.DispatchEvent(new MouseSwipeEvent(direction));
			this.HandleSwipeEnd();
		}
	}

	private HandleSwipeEnd():void {
		if (this.mIsSwiping) {
			this.mIsSwiping = false;
		}
	}

}
