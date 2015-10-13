/***
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

class Point {
	
	private mX:number;
	private mY:number;
	/**
	 *
	 */
	public constructor(aX:number = 0, aY:number = 0) {

		this.mX = aX;
		this.mY = aY;
	}
	
	public Clone():Point {
		
		return(new Point(this.mX, this.mY));
	}
	
	public get X():number { return(this.mX); }
	public set X(aValue:number) { this.mX = aValue; }
	
	public get Y():number { return(this.mY); }
	public set Y(aValue:number) { this.mY = aValue; }
	
	public Add(aPoint:Point):Point {
		
		this.mX += aPoint.X;
		this.mY += aPoint.Y;
		
		return this;
	}
	
	public Subtract(aPoint:Point):Point {
		
		this.mX -= aPoint.X;
		this.mY -= aPoint.Y;

		return this;
	}
	
	public Multiply(aValue:number):Point {
		
		this.mX *= aValue;
		this.mY *= aValue;
		
		return this;
	}
	
	public Invert():Point {
		
		this.mX *= -1;
		this.mY *= -1;

		return this;
	}
	
	public IsEqual(aPoint:Point):boolean {
		
		return this.mX === aPoint.X && this.mY === aPoint.Y;
	}
	
	public toString():string {
		
		return(this.mX + ", " + this.mY);
	}
}

export = Point;