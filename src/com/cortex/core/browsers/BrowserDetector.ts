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
 * @classdesc       Utilitary to detect browser versions.
 */
class BrowserDetector {
    private static IE_APP_NAME: string = "Microsoft Internet Explorer";
    private static IE_11_APP_NAME: string = "Netscape";
    private static IE_MIN_VER_NUMBER: number = 9;
    private static IE_REGEX_VERSIONS: RegExp = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    private static IE_11_REGEX_VERSIONS: RegExp = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");

    constructor() {
        /*** CONSTRUCTOR GOES HERE **/
    }
    /**
     * @description     Detect if browser is internet explorer
     *
     * @return          {Boolean} Returns true if internet explorer else false
     *
     * @memberof        com.cortex.core.browsers.BrowserDetector
     */
    public static DetectInternetExplorer(): boolean {
        if ((navigator.appName != null &&
             navigator.appName === BrowserDetector.IE_APP_NAME ||
             navigator.appName === BrowserDetector.IE_11_APP_NAME) &&
             BrowserDetector.ExtractIEVersion() >= BrowserDetector.IE_MIN_VER_NUMBER) {
            return true;
        }
        return false;
    }

    /**
     * @description     Get internet explorer versions
     *
     * @return          {Float} Returns internet explorer versions and -1 if not IE.
     *
     * @memberof        com.cortex.core.browsers.BrowserDetector
     */
    public static GetInternetExplorerVersion(): number {
        if (this.DetectInternetExplorer() === true) {
            return BrowserDetector.ExtractIEVersion();
        }

        return -1;
    }

    private static ExtractIEVersion(): number {
        if (BrowserDetector.IE_REGEX_VERSIONS.exec(navigator.userAgent) != null) {
            return parseFloat(RegExp.$1);
        } else if (BrowserDetector.IE_11_REGEX_VERSIONS.exec(navigator.userAgent) != null) {
            return parseFloat(RegExp.$1);
        }

    }
}

export = BrowserDetector;
