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
 import IUpdatable = require("./IUpdatable");
 
class UpdateManager {
	
	public static TARGET_FRAMERATE:number = 60;
	
	private static mUpdateCount:number = 0;
	private static mDelta:number = 0;
	
	private static mIntervalID:number;
	
	private static mInitialize:boolean;
	
    private static mUpdateList:Array<IUpdatable> = [];
	
	private static SetFPS():void{
		
		this.mDelta = 1000/this.TARGET_FRAMERATE;
		
		this.mIntervalID = setInterval(this.Update.bind(this), this.mDelta)
	}
	
	public static Register(aUpdatable:IUpdatable):void{
		
		if(!this.mInitialize){ 
		
			this.SetFPS();
			
			this.mInitialize = true;
		}
		
		if(this.mUpdateList.indexOf(aUpdatable) >= 0) { return; }
		
		this.mUpdateList.push(aUpdatable);
		this.mUpdateCount++;
	}
	
	public static Unregister(aUpdatable:IUpdatable):void{
		
		var updatableIndex:number = this.mUpdateList.indexOf(aUpdatable);
		
		if(updatableIndex <= -1) { return; }
		
		this.mUpdateList.splice(updatableIndex, 1);
		this.mUpdateCount--
		
		if(this.mUpdateCount === 0) {
			
			this.mInitialize = false;
			clearInterval(this.mIntervalID)
		}
	}
	
	private static Update():void{
		
		for(var i:number = this.mUpdateCount - 1; i >= 0; i-- ){
			
			this.mUpdateList[i].Update(this.mDelta);
		}
	}
}

export = UpdateManager;
