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
		this.mQuote = "\"Le don de soi est ce qu’on peut offrir de plus grand.\"";
		this.mQuoteAuthor = "-Ralph Waldo Emerson";
        this.mBackButtonText = "Découvrez nos autres bénévoles";
        this.mHeaderText = "Bénévoles";
		this.mBackButtonText = "Découvrez nos autres bénévoles";
		this.mNoSelectionClass = "profiles-selection-volunteers";

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
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, super.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	}
}
