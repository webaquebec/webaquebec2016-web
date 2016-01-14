import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import ProfileEvent from "./event/ProfileEvent";
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

		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, super.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	}
}
