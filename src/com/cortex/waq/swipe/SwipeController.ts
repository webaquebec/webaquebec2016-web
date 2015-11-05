import EventDispatcher from "../../core/event/EventDispatcher";

import MouseSwipeEvent from "../../core/mouse/event/MouseSwipeEvent";
import Mouse from "../../core/mouse/Mouse";

export default class SwipeController extends EventDispatcher {

	private static SWIPE_SENSIBILITY:number = 20;

	private mIsSwiping:boolean;

	private mSwipeStartX:number;

	private mTimeout:number;

	constructor() {
		super();
		this.mIsSwiping = false;
		this.mTimeout = -1;
		Mouse.Start();
	}

	public OnSwipeEvent(aEvent:MouseSwipeEvent):void {
		switch (aEvent.eventName) {
			case MouseSwipeEvent.SWIPE_BEGIN:
			this.HandleSwipeBegin();
			break;

			case MouseSwipeEvent.SWIPE_MOVE:
			this.HandleSwipeMove();
			break;

			default:
			case MouseSwipeEvent.SWIPE_END:
			this.HandleSwipeEnd();
			break;
		}
	}

	private HandleSwipeBegin():void {
		if (!this.mIsSwiping) {
			this.mIsSwiping = true;
			this.mSwipeStartX = Mouse.GetX();
			if (this.mTimeout !== -1) {
				window.clearTimeout(this.mTimeout);
			}
			// 500 ms time out
			this.mTimeout = window.setTimeout(this.HandleSwipeEnd.bind(this), 500);
		}
	}

	private HandleSwipeMove():void {
		if (this.mIsSwiping) {
			var mouseX:number = Mouse.GetX();
			var diffX:number = this.mSwipeStartX - mouseX;
			this.mSwipeStartX = mouseX;

			if (Math.abs(diffX) >= SwipeController.SWIPE_SENSIBILITY) {
				var direction:string = diffX < 0 ?
					MouseSwipeEvent.SWIPE_LEFT :
					MouseSwipeEvent.SWIPE_RIGHT;
				this.DispatchEvent(new MouseSwipeEvent(direction));
				this.HandleSwipeEnd();
			}
		}
	}

	private HandleSwipeEnd():void {
		if (this.mIsSwiping) {
			this.mIsSwiping = false;
		}
	}

}
