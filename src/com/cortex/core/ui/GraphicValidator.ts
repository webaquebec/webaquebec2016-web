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
 * @author Jonathan Roy
 */

import IGraphicValidatorError = require("./IGraphicValidatorError");

/**
 * @classdesc Provide a simple solution for easy form validation. Must be used with Cortex Template for graphic element
 */
class GraphicValidator {

    private static errorInputElements: any = [];
	
	public static ShowInputErrorMessage(aInputID:string, aMessage:string):void{
		
		var inputErrorContainer: HTMLDivElement = <HTMLDivElement>document.createElement("div");
       	var triangleElement: HTMLDivElement = <HTMLDivElement>document.createElement("div");
        var inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById(aInputID);
		
        triangleElement.className = "triangle-error";
		
		inputErrorContainer.id = aInputID + "Error";
        inputErrorContainer.className = "error-message-input";
        inputErrorContainer.textContent = aMessage;
        inputErrorContainer.appendChild(triangleElement);

        inputErrorContainer.style.width = String(inputElement.clientWidth) + "px";

        inputElement.parentNode.insertBefore(inputErrorContainer, inputElement.nextSibling);
        inputElement.style.borderColor = "#d7564d";
	}
	/**
	 *
	 */
    public static HideInputErrorMessage(aInputID:string): void {
		
		var inputErrorElement:HTMLDivElement = <HTMLDivElement>document.getElementById(aInputID+ "Error");
		
		if(inputErrorElement == null) { return; }
		
        var inputElement:HTMLInputElement = <HTMLInputElement>document.getElementById(aInputID);
		
       inputElement.parentElement.removeChild(document.getElementById(aInputID+ "Error"))
	   inputElement.style.borderColor = "";
    }
	
    /**
      * Output a styled error container with a output error to the user
      *
      * @memberof com.cortex.core.ui.GraphicValidator
      * @param {string} idElement - Id element of the HTMLElement who the message-container will be output
      * @param {string} msg - Message to be output to the user
      */
    public static ShowErrorMessageAtContainer(idElement: string, msg: string): void {
        var errorContainer: HTMLDivElement = (<HTMLDivElement>document.createElement("div"));
        var container: HTMLElement = (<HTMLElement>document.getElementById(idElement));

        errorContainer.className = "error-message-container";
        errorContainer.textContent = msg;

        container.appendChild(errorContainer);
    }

    /**
      * Remove all error container from the actual view
      *
      * @memberof com.cortex.core.ui.GraphicValidator
      */
    public static RemovesAllErrorMessages(): void {
        var errorMessages = document.querySelectorAll(".error-message-input, .error-message-container");
        var errorMessageLength: number = errorMessages.length;

        if (errorMessageLength > 0) {
            for (var i: number = 0; i < errorMessageLength; i++) {
                errorMessages[i].parentNode.removeChild(errorMessages[i]);
            }

            var lengthErrorInputElements = this.errorInputElements.length;

            if (lengthErrorInputElements > 0) {
                for (i = 0; i < lengthErrorInputElements; i++) {
                    this.errorInputElements[i].removeAttribute("style");
                }

                this.errorInputElements = [];
            }
        }
    }
}

export = GraphicValidator;
