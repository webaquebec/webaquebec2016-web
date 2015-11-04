import EventDispatcher from "../../core/event/EventDispatcher";

import MouseSwipeEvent from "../../core/mouse/event/MouseSwipeEvent";

import SwipeEvent from "./event/SwipeEvent";

export default class SwipeController extends EventDispatcher {
	
	private static SWIPE_SENSIBILITY:number = 20;
	
	private mIsSwiping:boolean;
	
	private mSwipeStartX:number;

	constructor() {
		super();
		this.mIsSwiping = false;
	}
	
	public OnSwipeEvent(aEvent:MouseSwipeEvent):void {
		switch (aEvent.state) {
			case MouseSwipeEvent.STATE_BEGIN:
			this.HandleSwipeBegin(aEvent);
			break;
			
			case MouseSwipeEvent.STATE_MOVE:
			this.HandleSwipeMove(aEvent);
			break;
			
			default:
			case MouseSwipeEvent.STATE_END:
			this.HandleSwipeEnd(aEvent);
			break;
		}
	}
	
	private HandleSwipeBegin(aEvent:MouseSwipeEvent):void {
		if (!this.mIsSwiping) {
			this.mIsSwiping = true;
			this.mSwipeStartX = aEvent.locationX;
		}
	}
	
	private HandleSwipeMove(aEvent:MouseSwipeEvent):void {
		if (this.mIsSwiping) {
			var diffX:number = this.mSwipeStartX - aEvent.locationX;
			this.mSwipeStartX = aEvent.locationX;
			
			if (Math.abs(diffX) >= SwipeController.SWIPE_SENSIBILITY) {
				var direction:string = diffX < 0 ? SwipeEvent.SWIPE_LEFT : SwipeEvent.SWIPE_RIGHT;
				this.DispatchEvent(new SwipeEvent(direction));
				this.HandleSwipeEnd(aEvent);
			}
		}
	}
	
	private HandleSwipeEnd(aEvent:MouseSwipeEvent):void {
		if (this.mIsSwiping) {
			this.mIsSwiping = false;
		}
	}
	
}