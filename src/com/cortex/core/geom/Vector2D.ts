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
import Point = require("./Point");

class Vector2D 
{
	public static DEG_TO_RAD:number = Math.PI / 180;
	public static RAD_TO_DEG:number = 180 / Math.PI;

	private mPointA:Point;
	private mPointB:Point;
	/**
	 *
	 */
	public constructor(aPointA:Point = null, aPointB:Point = null) {

		this.mPointA = aPointA == null ? new Point() : aPointA;
		this.mPointB = aPointB == null ? new Point() : aPointB;
	}
	/**
	 *
	 */
	public Clone():Vector2D
	{
		return(new Vector2D(this.mPointA.Clone(), this.mPointB.Clone()));
	}
	/**
	 *
	 */
	public GetPointA():Point { return(this.mPointA); }
	public GetPointB():Point { return(this.mPointB); }
	/**
	 *
	 */
	public Add(aVector:Vector2D):Vector2D
	{
		this.mPointA.Add(aVector.GetPointA());
		this.mPointB.Add(aVector.GetPointB());
		
		return this;
	}
	/**
	 *
	 */
	public Subtract(aVector:Vector2D):Vector2D
	{
		this.mPointA.Subtract(aVector.GetPointA());
		this.mPointB.Subtract(aVector.GetPointB());

		return this;
	}
	/**
	 *
	 */
	public Multiply(aValue:number):Vector2D
	{
		var newDifferenceX = this.GetDifferenceX() * aValue;
		var newDifferenceY = this.GetDifferenceY() * aValue;

		this.mPointB.X = this.mPointA.X + newDifferenceX;
		this.mPointB.Y = this.mPointA.Y + newDifferenceY;
		
		return this;
	}
	/**
	 *
	 */
	public Rotate(aAngle:number):Vector2D
	{
		this.SetAngle(this.GetAngle() + aAngle);

		return this;
	}
	/**
	 *
	 */
	public Intersect(aVector:Vector2D ):Point
	{
		var crossProduct:number = this.CrossProduct(aVector);

		var differenceAX:number = this.mPointA.X - aVector.GetPointA().X;
		var differenceAY:number = this.mPointA.Y - aVector.GetPointA().Y;
		
		var numeratorA:number = aVector.GetDifferenceX() * differenceAY - aVector.GetDifferenceY() * differenceAX;
		var numeratorB:number = this.GetDifferenceX() * differenceAY - this.GetDifferenceY() * differenceAX;

		if(crossProduct == 0) {

			if(numeratorA == 0 && numeratorB == 0) {
				// vectors are coincidents
				return null; 
			}
			// vectors are parallels
			return null;
		}

		var unitA:number = numeratorA / crossProduct;
		var unitB:number = numeratorB / crossProduct;

		if(unitA >= 0 && unitA <= 1 && unitB >= 0 && unitB <= 1) {
			// Get the intersection point.
			return new Point(this.mPointA.X + unitA * this.GetDifferenceX(), this.mPointA.Y + unitA * this.GetDifferenceY());
		}
		
		return null;
	}
	/**
	 *
	 */
	public Invert():Vector2D
	{
		this.mPointA.X *= -1;
		this.mPointA.Y *= -1;
		this.mPointB.X *= -1;
		this.mPointB.Y *= -1;

		return this;
	}
	/**
	 *
	 */
	public Project(aVector:Vector2D):Vector2D
	{
		var projectedVector:Vector2D = aVector.Clone();

		var scalar:number = this.DotProduct(aVector) / Math.pow(aVector.GetLength(),2);

		projectedVector.Multiply(scalar);
		
		return projectedVector;
	}
	/**
	 *
	 */
	public Reflect(aVector:Vector2D, aIntersect:Point):Vector2D
	{
		var reflectedVector:Vector2D = new Vector2D(aVector.GetPointA().Clone(), aIntersect.Clone());

		var vectorNormal:Vector2D = new Vector2D(this.mPointA.Clone(), this.mPointA.Clone().Add(this.GetRightNormal()));
		
		var dotProduct:number = aVector.DotProduct(vectorNormal);

		var reflectionX:number = aVector.GetDifferenceX() - 2 * vectorNormal.GetDifferenceX() * dotProduct;
		var reflectionY:number = aVector.GetDifferenceY() - 2 * vectorNormal.GetDifferenceY() * dotProduct;
		
		reflectedVector.GetPointA().X = aIntersect.X;
		reflectedVector.GetPointA().Y = aIntersect.Y;

		reflectedVector.GetPointB().X = reflectedVector.GetPointA().X + reflectionX;
		reflectedVector.GetPointB().Y = reflectedVector.GetPointA().Y + reflectionY;

		return reflectedVector;
	}
	/**
	 *
	 */
	public PerProduct(aVector:Vector2D):number
	{
		var horizontalVector:Vector2D = new Vector2D(aVector.GetPointA().Clone(), aVector.GetRightNormal());

		return(this.DotProduct(horizontalVector));
	}
  	/**
  	 *
  	 */
	public DotProduct(aVector:Vector2D):number
	{
		return this.GetDifferenceX() * aVector.GetDifferenceX() + this.GetDifferenceY() * aVector.GetDifferenceY();
	}
	/**
	 *
	 */
	public CrossProduct(aVector:Vector2D):number
	{
		return(this.GetDifferenceX() * aVector.GetDifferenceY() - this.GetDifferenceY() * aVector.GetDifferenceX());
	}
	/**
	 *
	 */
	public AngleBetweenVector(aVector:Vector2D):number
	{
		return aVector.GetAngle() - this.GetAngle();
	}
	/**
	 *
	 */
	public SinAngleBetweenVector(aVector:Vector2D):number
	{
		return this.CrossProduct(aVector) / (this.GetLength() * aVector.GetLength());
	}
	/**
	 *
	 */
	public CosAngleBetweenVector(aVector:Vector2D):number
	{
		return this.DotProduct(aVector) / (this.GetLength() * aVector.GetLength());
	}
	/**
	 *
	 */
	public GetPointOnLength(aPercentage:number):Point
	{
		return(new Point(this.mPointA.X + this.GetDifferenceX() * aPercentage, this.mPointA.Y + this.GetDifferenceY() * aPercentage));
	}
	/**
	 *
	 */
	public GetDifferenceX():number{

		return(this.mPointB.X - this.mPointA.X);
	}
	/**
	 *
	 */
	public GetDifferenceY():number{

		return(this.mPointB.Y - this.mPointA.Y);
	}
	/**
	 *
	 */
	public GetUnitX():number {

		return(this.GetDifferenceX() / this.GetLength());
	}
	/**
	 *
	 */
	public GetUnitY():number {

		return(this.GetDifferenceY() / this.GetLength());
	}
	/**
	 *
	 */
	public GetUnitVector():Vector2D
	{
		return new Vector2D(this.mPointA.Clone(), this.mPointA.Clone().Add(new Point(this.GetUnitX(), this.GetUnitY())));
	}
	/**
	 *
	 */
	public GetRightNormal():Point
	{
		return new Point(this.GetUnitY(), -this.GetUnitX());
	}
	/**
	 *
	 */
	public GetLeftNormal():Point
	{
		return new Point(-this.GetUnitY(), this.GetUnitX());
	}
	/**
	 *
	 */
	public IsNormal(aVector:Vector2D):boolean
	{
		return (this.DotProduct(aVector) == 0);
	}
	/**
	 *
	 */
	public IsEqual(aVector:Vector2D):boolean
	{
		return aVector.GetDifferenceX() == this.GetDifferenceX() && aVector.GetDifferenceY() == this.GetDifferenceY();
	}
	/**
	 *
	 */
	public GetAngle():number
	{
		return Math.atan2(this.GetDifferenceY(), this.GetDifferenceX());
	}
	/**
	 *
	 */
	public SetAngle(aAngle:number):void
	{
		var angleRadians:number = aAngle * Vector2D.DEG_TO_RAD;
		
		var length:number = this.GetLength();

		this.mPointB.X = this.mPointA.X + length * Math.cos(angleRadians);
		this.mPointB.Y = this.mPointA.Y + length * Math.sin(angleRadians);
	}
	/**
	 *
	 */
	public GetLength():number {

		return(Math.sqrt(Math.pow(this.GetDifferenceX(), 2) + Math.pow(this.GetDifferenceY(), 2)));
	}
	/**
	 *
	 */
	public SetLength(aLength:number):void {

		if (isNaN(aLength)) {
			
			this.mPointA.X = this.mPointA.Y = this.mPointB.X = this.mPointB.Y = 0;
		}

		var currentLength:number = this.GetLength();

		if (0 < currentLength) {

			this.Multiply(aLength / currentLength);

		} else {

			this.mPointA.Y = this.mPointB.Y = 0;
			this.mPointB.X = this.mPointA.X + aLength;
		}
	}
	public toString():String
	{
		return(this.mPointA + ", " + this.mPointB);
	}
}

export = Vector2D;