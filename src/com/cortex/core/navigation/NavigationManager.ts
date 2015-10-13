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
 import INavigable = require("./INavigable");
 
class NavigationManager {
	
	private static mInitialize:boolean;
	
	private static mListLength:number = 0;
	
    private static mNavigableList:Array<INavigable> = [];
	
	public static Register(aNavigable:INavigable):void{
		
		if(!this.mInitialize){ 
			
			this.mInitialize = true;
		}
		
		if(this.mNavigableList.indexOf(aNavigable) >= 0) { return; }
		
		this.mNavigableList.push(aNavigable);
		this.mListLength++;
	}
	
	public static Unregister(aNavigable:INavigable):void{
		
		var keyBindableIndex:number = this.mNavigableList.indexOf(aNavigable);
		
		if(keyBindableIndex <= -1) { return; }
		
		this.mNavigableList.splice(keyBindableIndex, 1);
		this.mListLength--
		
		if(this.mListLength == 0) {
			
		}
	}
	
	public static NavigateTo(aPath:string):INavigable{
		
		for(var i:number = 0; i < this.mListLength; i++){
			
			var routeList:Array<string> = this.mNavigableList[i].GetRouteList();
			
			for(var j:number = 0; j < routeList.length; j++){
				
				if(routeList[j] == aPath){
					
					return(this.mNavigableList[i]);
				}
			}
		}
		
		return(null);
	}
}

export = NavigationManager;
