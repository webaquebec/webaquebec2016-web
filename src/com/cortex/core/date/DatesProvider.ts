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
 * @author Mathieu Rhéaume
 */

/**
  * @classdesc Provides Localized Dates related descriptions.
  */
class DatesProvider {
    private static mFrenchMonthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
    private static mFRENCH_ID = "fr";
    /**
      * @constructor
      */
    constructor() {
        /*** CONSTRUCTOR GOES HERE **/
    }

    /**
      * @memberof com.cortex.core.data.DatesProvider
      * @param {string} [aLang=fr] - Language to get the output
      */
    public static getFormattedDate(aLang?: string) {
        var dateObject = new Date();
        return dateObject.getDate() +
            " " +
            DatesProvider.getMonthName(DatesProvider.mFRENCH_ID, dateObject.getMonth()) +
            " " +
            dateObject.getFullYear();
    }

    /**
      * @memberof com.cortex.core.data.DatesProvider
      * @param {string} [aLang=fr] - Language to get the output
      * @param {number} aMonthId - Month to use.
      */
    public static getMonthName(aLang?: string, aMonthId?: number) {
        if (aLang === undefined || aLang === DatesProvider.mFRENCH_ID) {
            if (aMonthId !== undefined) {
                return this.mFrenchMonthNames[aMonthId];
            } else {
                var dateObject = new Date();
                return this.mFrenchMonthNames[dateObject.getMonth()];
            }
        }
        return "";
    }
}

export = DatesProvider;
