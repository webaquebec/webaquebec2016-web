import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import ProfileEvent from "./event/ProfileEvent";
import Profile from "./data/Profile";
import ProfilesController from "./ProfilesController";

export default class PartnerController extends ProfilesController {

	constructor() {

		super();
	}

	public Init():void {

		super.Init();

		this.LoadPartners();
	}

	private LoadPartners():void{

		this.mTitle = "Découvrez nos précieux partenaires qui contribuent au succès de l'évènement.";
		this.mQuote = "\"La seule voie qui offre quelque espoir d'un avenir meilleur pour toute l'humanité" +
						" est celle de la coopération et du partenariat.\"";
		this.mQuoteAuthor = "-Kofi Annan";
        this.mHeaderText = "Partenaires";
		this.mBackButtonText = "Découvrez nos autres partenaires";
		this.mNoSelectionClass = "profiles-selection-partners";

		if(this.mProfilesModel.IsPartnersLoaded()) {

			this.OnDataReady(null);

		}else{

			this.mProfilesModel.AddEventListener(ProfileEvent.PARTNERS_LOADED, this.OnDataReady, this);
			this.mProfilesModel.FetchPartners();
		}
	}

	protected OnDataReady(aEvent:MVCEvent) {

		this.mProfilesModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnDataReady, this);

		this.mProfiles = this.mProfilesModel.GetPartners();

		this.mProfiles.sort(function(a:Profile, b:Profile):any {
			if (a.order > b.order) {
				return 1;
			} else if(a.order < b.order) {
				return -1;
			} else {
				return 0;
			}
		});

		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	}
	
	protected OnTemplateLoaded(aEvent:MVCEvent):void {

		super.OnTemplateLoaded(aEvent);

		document.getElementById("profiles-selected-name").style.display="none";
	}
}
