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
 import IKeyBindable = require("./IKeyBindable");
 
class KeyManager {
	
	private static mInitialize:boolean;
	
	private static mListLength:number = 0;
	
    private static mKeyList:Array<number> = [];
    private static mKeyBindableList:Array<IKeyBindable> = [];
	
	public static Register(aKeyBindable:IKeyBindable):void{
		
		if(!this.mInitialize){ 
		
			document.addEventListener('keydown', this.OnKeyDown.bind(this));
			document.addEventListener('keyup', this.OnKeyUp.bind(this));
			
			this.mInitialize = true;
		}
		
		if(this.mKeyBindableList.indexOf(aKeyBindable) >= 0) { return; }
		
		this.mKeyBindableList.push(aKeyBindable);
		this.mListLength++;
	}
	
	public static Unregister(aKeyBindable:IKeyBindable):void{
		
		var keyBindableIndex:number = this.mKeyBindableList.indexOf(aKeyBindable);
		
		if(keyBindableIndex <= -1) { return; }
		
		this.mKeyBindableList.splice(keyBindableIndex, 1);
		this.mListLength--
		
		if(this.mListLength == 0) {
			
			document.removeEventListener('keydown', this.OnKeyDown.bind(this));
			document.removeEventListener('keyup', this.OnKeyUp.bind(this));
		}
	}
	
	private static OnKeyDown(aEvent:KeyboardEvent) : void {
		
		var keyListIndex:number = this.mKeyList.indexOf(aEvent.keyCode);
		
		if(keyListIndex >= 0) { return; }
		
		this.mKeyList.push(aEvent.keyCode);
		
		var keyBindableListLength:number = this.mKeyBindableList.length;
		
		for(var i:number = 0; i < keyBindableListLength; i++){
			
			this.mKeyBindableList[i].KeyPressed(this.mKeyList);
		}
	}
	
	private static OnKeyUp(aEvent:KeyboardEvent) : void {
		
		var keyListIndex:number = this.mKeyList.indexOf(aEvent.keyCode);
		
		this.mKeyList.splice(keyListIndex, 1);
	}
}

export = KeyManager;
