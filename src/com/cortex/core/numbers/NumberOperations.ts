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
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu Rhéaume
 */

/**
 * @classdesc       Utilitary to do usual operations with numbers
 */
class NumberOperations {
    constructor() {
        /*** CONSTRUCTOR GOES HERE **/
    }
    /**
     * @description     Returns the sum of the array aggregated
     *
     * @param           {Array<Number>} aNumberList - Values to be aggregated
     *
     * @return          {Number} Aggregation of the Array
     *
     * @memberof        com.cortex.core.numbers.NumberOperations
     */
    public static Sum(aNumberList: number[]): number {
        var totalToReturn: number = 0;

        if (aNumberList != null) {
            var i: number,
                lengthObjectToAggregate: number,
                objectToWorkOn: number,
                typeNumber: any;
            typeNumber = typeof(totalToReturn);
            lengthObjectToAggregate = aNumberList.length;

            for (i = 0; i < lengthObjectToAggregate; i = i + 1) {
                
                objectToWorkOn = aNumberList[i];
                
                totalToReturn = totalToReturn + objectToWorkOn;
            }
        }

        return totalToReturn;
    }
}

export = NumberOperations;
