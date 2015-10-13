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
 * @copyright    Cortex Media 2014
 *
 * @author Mathieu 'Sanchez' Cote
 */
import LazyLoader = require("../net/LazyLoader");
import EventDispatcher = require("../event/EventDispatcher");
import MVCEvent = require("../mvc/event/MVCEvent");

class Localizer extends EventDispatcher {

    private mLanguagePath: string;

    private mSectionList: Array<any>;
    /***
     *
     */
    constructor( aLanguagePath: string ) {

        super();

        this.mLanguagePath = aLanguagePath;
    }
    /***
     *
     */
    public Destroy(): void {

        this.mSectionList.length = 0;
        this.mSectionList = undefined;
        
        super.Destroy();
    }
    /***
     *
     */
    public SwitchLanguage( aLanguagePath: string ): void {

        this.mLanguagePath = aLanguagePath;

        this.LoadJSON();
    }
    /***
     *
     */
    public LoadJSON() {

        if ( this.mLanguagePath !== "" ) {

            this.Fetch();
        } else {

            this.OnJSONLoadSuccess( [] );
        }
    }
    /***
     *
     */
    private Fetch(): void {

        var promise = LazyLoader.loadJSON( this.mLanguagePath );
        promise.then(() => this.OnJSONLoadSuccess( promise.result ) );
        promise.fail(() => this.OnJSONLoadError() );
    }
    /***
     *
     */
    public OnJSONLoadError(): void {

        console.log( "There was an error loading, ", this.mLanguagePath );
    }
    /***
     *
     */
    public OnJSONLoadSuccess( aJSONData ): void {

        this.mSectionList = new Array<any>();

        for ( var prop in aJSONData.attributes ) {

            if ( aJSONData.attributes.hasOwnProperty( prop ) ) {

                this.mSectionList.push( prop );
            }
        }
        this.DispatchEvent( new MVCEvent( MVCEvent.JSON_LOADED ) );
    }

    public GetSection( aSectionID: number ): any {

        var sectionListLength: number = this.mSectionList.length;

        for ( var i: number = 0; i < sectionListLength; i++ ) {

            if ( this.mSectionList[i].section === aSectionID ) {

                return ( this.mSectionList[i] );
            }
        }

        return ( null );
    }
}

export = Localizer;
