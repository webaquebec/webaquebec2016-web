import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import PartnerLevelModel from "../partnerlevel/PartnerLevelModel";
import PartnerLevel from "../partnerlevel/data/PartnerLevel";

import ProfileEvent from "./event/ProfileEvent";
import Partner from "./data/Partner";
import Profile from "./data/Profile";
import ProfilesController from "./ProfilesController";

export default class PartnerController extends ProfilesController {

	private mPartnerLevelModel:PartnerLevelModel;

	constructor() {

		super();
	}

	public Init():void {

		super.Init();

		this.mPartnerLevelModel = PartnerLevelModel.GetInstance();

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
        this.mGridViewClass = "profiles-grid-partners";

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

		if(this.mPartnerLevelModel.IsLoaded()) {

			this.OnPartnerLevelLoaded(null);

		} else {

			this.mPartnerLevelModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnPartnerLevelLoaded, this);
			this.mPartnerLevelModel.FetchPartnerLevels();
		}
	}

	private OnPartnerLevelLoaded(aEvent:MVCEvent):void{

		this.mPartnerLevelModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnPartnerLevelLoaded, this);

		for(var i:number = 0, max = this.mProfiles.length; i < max; i++){

			var partner:Partner = <Partner>this.mProfiles[i];
			var partnerLevel:PartnerLevel = this.mPartnerLevelModel.GetPartnerLevelByID(partner.partnerLevelID);
			partner.partnerLevel = partnerLevel;
			partner.subtitle = partnerLevel.title;
		}

		this.mProfilesView = new AbstractView();
		this.mProfilesView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	}

	protected OnTemplateLoaded(aEvent:MVCEvent):void {

		super.OnTemplateLoaded(aEvent);

		document.getElementById("profiles-selected-name").classList.add("title-background");
	}
}
