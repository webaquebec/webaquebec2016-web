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
 * @author Mathieu Rhéaume
 */
 
/**
 * @classdesc Provide a of manipulating the dom easily when doing the usualy dom operations.
 */
class DomManipulator {

	/**
	  * Creates a HTMLElement and append the text to the element.
	  *
	  * @memberof com.cortex.core.ui.DomManipulator
	  * @param {string} aElementType - Element name. IE : a, p, ul, li
	  * @param {string} aTextToAppend (optionnal) - Text to append to the node
	  * @param {string} aClassName (optionnal) - ClassName to assign
	  * @param {HTMLElement|Node} aNodeToAppend (optionnal) - Node to append to
	  */
	public static CreateElement( aElementType: string,
		aTextToAppend?: string,
		aClassName?: string,
		aNodeToAppendTo?: Node ): HTMLElement;

	public static CreateElement( aElementType: string,
		aTextToAppend: string = "",
		aClassName: string = "",
		aNodeToAppendTo?: HTMLElement ): HTMLElement {

		var newHTMLElement: HTMLElement = document.createElement( aElementType );

		newHTMLElement.textContent = aTextToAppend;
		newHTMLElement.className = aClassName;
		
		if(aNodeToAppendTo != null){
			
			aNodeToAppendTo.appendChild( newHTMLElement );
		}
		
		
		return newHTMLElement;
	}
	/**
	 * Creates a HTMLElement and append the text to the element.
	 * 
	 * @param {string} aElementType - Element name. IE : a, p, ul, li
	 * @param {string} aClassName (optionnal) - ClassName to assig
	 * @param {string} aTextToAppend (optionnal) - Text to append to the nod
	 * @param {Array<HTMLElement>} aChildList (optionnal) - List of child to append with the element
	 * 
	 * @memberof com.cortex.core.ui.DomManipulator
	 */
	public static CreateElementWithChild( aElementType: string,
		aClassName?: string,
		aTextToAppend?: string,
		aChildList?: Array<HTMLElement> ): HTMLElement {

		var element: HTMLElement = document.createElement( aElementType );

		element.className = aClassName;

		if ( aTextToAppend != null ) {

			var textNode: any = document.createTextNode( aTextToAppend );
			aChildList.push( textNode );
		}

		if ( aChildList != null ) {

			var childListLength: number = aChildList.length;

			for ( var i: number = 0; i < childListLength; i++ ) {

				element.appendChild( aChildList[i] );
			}
		}
		return element;
	}
	/**
	  * Create a HTMLOptionElement with value and text
	  *
	  * @memberof com.cortex.core.ui.DomManipulator
	  * @param {string} aTextToAppend - Text to append to the node
	  * @param {any} aValue - Value to append to the node
	  */
	public static CreateOptionElement( aTextToAppend: string, aValue: any ): HTMLOptionElement {

		var optionElement: HTMLOptionElement = ( <HTMLOptionElement>DomManipulator.CreateElement( "option", aTextToAppend ) );
		optionElement.value = aValue;
		return optionElement;
	}

	/**
	  * Creates a ul HTMLElement and append li's with the text to the element.
	  *
	  * @memberof com.cortex.core.ui.DomManipulator
	  * @param {string[]} aListOfStringToAppend - List of string to create li element
	  * @param {string} aCoreListType (optionnal) - Type of the main element (often ul or thead or tbody)
	  * @param {string} aElementTypes (optionnal) - Type of the child elements (often tr td or li)
	  */
	public static CreateListOfElement( aStringToAppendList: string[],
		aCoreListType: string = "ul",
		aElementType: string = "li" ): HTMLElement {

		var newHTMLList: HTMLElement = document.createElement( aCoreListType );
		var stringToAppendListLength: number = aStringToAppendList.length;

		var newLi: HTMLElement;

		for ( var i: number = 0; i < stringToAppendListLength; i = i + 1 ) {

			newLi = document.createElement( aElementType );
			newLi.appendChild( document.createTextNode( aStringToAppendList[i] ) );
			newHTMLList.appendChild( newLi );
		}

		return newHTMLList;
	}

	/**
	  * Set text content for a element by id
	  *
	  * @memberof com.cortex.core.ui.DomManipulator
	  * @param {string} aId = Id of element
	  * @param {string} aText = Text to append
	  */
	public static SetTextOfElementById( aId: string, aText: string ): void {

		var element = document.getElementById( aId );
		element.textContent = aText;
	}
}

export = DomManipulator;
