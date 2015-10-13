/**
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
 * @author Mathieu 'Sanchez' Cote
 */
import Point = require("../geom/Point");

class Mouse {
	
	private static mPosition:Point = new Point(0,0);
	
	public static GetX():number { return (this.mPosition.X) ;}
	public static GetY():number { return (this.mPosition.Y) ;}
	
	public static GetPosition():Point { return(this.mPosition); }
	
	public static OnMouseMove(aEvent:MouseEvent):void{
		
		Mouse.mPosition.X = aEvent.clientX || aEvent.pageX;
		Mouse.mPosition.Y = aEvent.clientY || aEvent.pageY;
	}
	
	public static Start():void{
		
		document.addEventListener("mousemove", Mouse.OnMouseMove);
	}
	
	public static Stop():void{
		
		document.removeEventListener("mousemove", Mouse.OnMouseMove);
	}
}

export = Mouse;
