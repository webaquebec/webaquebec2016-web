import EConfig from "../main/EConfig";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import ProfileEvent from "./event/ProfileEvent";
import ProfilesController from "./ProfilesController";

export default class VolunteerController extends ProfilesController {

	constructor() {

		super();
	}

	public Init():void {

		super.Init();

		this.LoadVolunteers();
	}

	private LoadVolunteers():void{

		this.mTitle = "Découvrez qui sont les bénévoles qui font du WAQ une vraie réussite.";
		this.mQuote = "« Le don de soi est ce qu’on peut offrir de plus grand. »";
		this.mQuoteAuthor = "— Ralph Waldo Emerson";
        this.mHeaderText = "Bénévoles";
		this.mBackButtonText = "Découvrez nos autres bénévoles";
		this.mNoSelectionClass = "profiles-selection-volunteers";
        this.mGridViewClass = "profiles-grid-volunteers";

		if(this.mProfilesModel.IsVolunteersLoaded()) {

			this.OnDataReady(null);

		}else{

			this.mProfilesModel.AddEventListener(ProfileEvent.VOLUNTEERS_LOADED, this.OnDataReady, this);
			this.mProfilesModel.FetchVolunteers();
		}
	}

	protected OnDataReady(aEvent:MVCEvent) {

		this.mProfilesModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnDataReady, this);

		this.mProfiles = this.mProfilesModel.GetVolunteers();

		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	}

	protected OnTemplateLoaded(aEvent:MVCEvent):void{

		var title:string = 'Bénévoles' + EConfig.TITLE_SEPARATOR + EConfig.TITLE;
		var description:string = "Découvrez qui sont les bénévoles qui font du WAQ une vraie réussite.";

		document.title = title;
		document.getElementsByName('og:title')[0].setAttribute('content', title);
		document.getElementsByName('description')[0].setAttribute('content', description);
		document.getElementsByName('og:description')[0].setAttribute('content', description);
		document.getElementsByName("og:url")[0].setAttribute("content", window.location.href);

		super.OnTemplateLoaded(aEvent)
	}
}
