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
 * @copyright Cortex Media 2015
 *
 * @author Étienne Bergeron-Paquet
 */

import Event from "../../event/Event";

export default class MouseSwipeEvent extends Event {
	
	static SWIPE:string = "com.cortex.core.mouse.event.MouseTouchEvent::SWIPE";
	
	static STATE_BEGIN:number = 0;
	static STATE_MOVE:number = 1;
	static STATE_END:number = 2;
	
	private mState:number;
	private mLocationX:number;
	private mLocationY:number;

	constructor(aEventName:string) {
		super(aEventName);
	}
	
	public set state(aState) { this.mState = aState; }
	public get state():number { return this.mState; }
	
	public set locationX(aLocationX) { this.mLocationX = aLocationX; }
	public get locationX():number { return this.mLocationX; }
	
	public set locationY(aLocationY) { this.mLocationY = aLocationY; }
	public get locationY():number { return this.mLocationY; }
	
}