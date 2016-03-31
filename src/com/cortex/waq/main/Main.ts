import EventDispatcher from "../../core/event/EventDispatcher";

import IKeyBindable from "../../core/key/IKeyBindable";
import KeyManager from "../../core/key/KeyManager";

import MouseSwipeEvent from "../../core/mouse/event/MouseSwipeEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";

import { Router } from "cortex-toolkit-js-router";

import IAction from "./IAction";
import EConfig from "./EConfig";

import AnimationEvent from "../animation/event/AnimationEvent";
import AnimationController from "../animation/AnimationController";

import BlogController from "../blog/BlogController";
import BlogModel from "../blog/BlogModel";
import BlogPost from "../blog/data/BlogPost";

import ProfilesModel from "../profiles/ProfilesModel";
import Profile from "../profiles/data/Profile";
import ProfileEvent from "../profiles/event/ProfileEvent";

import ConferenceModel from "../conference/ConferenceModel";
import Conference from "../conference/data/Conference";

import ContactController from "../contact/ContactController";

import HeaderController from "../header/HeaderController";

import HomeController from "../home/HomeController";

import ProfilesController from "../profiles/ProfilesController";
import SpeakerController from "../profiles/SpeakerController";
import PartnerController from "../profiles/PartnerController";
import VolunteerController from "../profiles/VolunteerController";

import ScheduleController from "../schedule/ScheduleController";

import SwipeController from "../swipe/SwipeController";

import TicketsController from "../tickets/TicketsController";
import AnalyticHelper from "../helpers/AnalyticHelper";

export default class Main extends EventDispatcher implements IKeyBindable {

	private static KEY_LEFT:number = 37;
	private static KEY_RIGHT:number = 39;

	private static CORE_ELEMENT_ID:string = "core";

	private mHeaderController:HeaderController;
	private mCurrentController:EventDispatcher;
	private mPreviousController:EventDispatcher;
	private mCurrentAction:string;

	private mAnimationController:AnimationController;
	private mActions:Array<IAction>;
	private mTotalActions:number;

	private mBlogModel:BlogModel;
	private mProfileModel:ProfilesModel;
	private mConferenceModel:ConferenceModel;

	private mRouter:Router;

	private mSwipeController:SwipeController;

	private mKeyLeft:boolean;
	private mKeyRight:boolean;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {

		KeyManager.Register(this);

		if(window.location.hash.indexOf("!") < 0){
			var hash:string = window.location.hash;
			window.location.hash = "#!" + hash.slice(1, hash.length)
		}

		this.mActions = [
				{routes: ["", "!", "!accueil", "!home"], callback:this.ShowHomeScreen.bind(this)},
				{routes: ["!billets", "!tickets"], callback:this.ShowTickets.bind(this)},
				{routes: ["!horaire", "!schedule"], callback:this.ShowSchedule.bind(this)},
				{routes: ["!blogue", "!blog"], callback:this.ShowBlog.bind(this)},
				{routes: ["!conferenciers"], callback:this.ShowSpeakers.bind(this)},
				{routes: ["!benevoles"], callback:this.ShowVolunteers.bind(this)},
				{routes: ["!partenaires"], callback:this.ShowPartners.bind(this)},
				{routes: ["!contact"], callback:this.ShowContact.bind(this)}
			];

		this.mTotalActions = this.mActions.length;

		this.mKeyLeft = false;
		this.mKeyRight = false;

		this.mHeaderController = new HeaderController();
		this.mAnimationController = new AnimationController();

		this.mSwipeController = new SwipeController();
		this.mSwipeController.AddEventListener(MouseSwipeEvent.SWIPE_LEFT, this.OnSwipeLeftEvent, this);
		this.mSwipeController.AddEventListener(MouseSwipeEvent.SWIPE_RIGHT, this.OnSwipeRightEvent, this);

		this.mBlogModel = BlogModel.GetInstance();
		this.mProfileModel = ProfilesModel.GetInstance();
		this.mConferenceModel = ConferenceModel.GetInstance();

		this.mRouter = Router.GetInstance();

		this.SetupRouting();

		document.addEventListener("DOMContentLoaded", this.OnContentLoaded.bind(this), false);
	}

	private OnContentLoaded():void {

		document.removeEventListener("DOMContentLoaded", this.OnContentLoaded.bind(this), false);

		this.mSwipeController.InitOnElement(Main.CORE_ELEMENT_ID);
		if (!("ontouchstart" in document.documentElement)) {
			document.documentElement.className += " no-touch";
		}
	}

	public KeyPressed(aKeyList:Array<number>):void {

		if(aKeyList.indexOf(16) >= 0 && aKeyList.indexOf(83) >= 0){
			var routes:Array<any> = this.mRouter.GetRoutes();

			for(var i:number = 0; i < routes.length; i++){
				console.log("node doWork.js \"http://webaquebec.org/#" + routes[i].Path + "\" \"" + routes[i].Path.slice(1, routes[i].Path.length) +".html\"")
			}
		}
		if (!this.mKeyLeft && aKeyList.indexOf(Main.KEY_LEFT) != -1) {
			this.NavigateSideways(-1);
		}

		if (!this.mKeyRight && aKeyList.indexOf(Main.KEY_RIGHT) != -1) {
			this.NavigateSideways(1);
		}

		if (!this.mAnimationController.IsAnimating){
			this.UpdateKeyStates(aKeyList);
		}
	}

	public KeyReleased(aKeyList:Array<number>):void {
		this.UpdateKeyStates(aKeyList);
	}

	private UpdateKeyStates(aKeyList:Array<number>):void {
		this.mKeyLeft = aKeyList.indexOf(Main.KEY_LEFT) != -1;
		this.mKeyRight = aKeyList.indexOf(Main.KEY_RIGHT) != -1;
	}

	private OnSwipeLeftEvent(aEvent:MouseSwipeEvent):void {
		this.NavigateSideways(-1);
	}

	private OnSwipeRightEvent(aEvent:MouseSwipeEvent):void {
		this.NavigateSideways(1);
	}

	private NavigateSideways(aDirection:number) {

		if (this.mAnimationController.IsAnimating) { return };

		this.mHeaderController.OnMenuClose();

		var nextPageIndex:number = this.GetPageIndex(this.mCurrentAction) + aDirection;

		if (nextPageIndex >= 0 && nextPageIndex < this.mTotalActions) {
			Router.GetInstance().Navigate(this.mActions[nextPageIndex].routes[0]);
		}
	}

	private SetupRouting():void {

		for (var i:number = 0; i < this.mTotalActions; i++) {

			var currentAction:IAction = this.mActions[i];

			var currentRoutes:Array<string> = currentAction.routes;

			for (var j:number = 0, jMax:number = currentRoutes.length; j < jMax; j++) {
				this.mRouter.AddHandler(currentRoutes[j], this.WrapRouterCallback(currentAction.callback));
			}
		}

		this.mBlogModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnBlogJSONLoaded, this);

		this.mBlogModel.FetchBlogPosts();
	}

	private WrapRouterCallback(callback:()=>void):()=>any {
		var CallbackFunction = function():void {
			AnalyticHelper.SendEvent();
			callback.bind(this)();
		};
		return CallbackFunction.bind(this);
	}

	private OnBlogJSONLoaded(aEvent:MVCEvent):void {

		this.mBlogModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnBlogJSONLoaded, this);

		var blogPosts = this.mBlogModel.GetBlogPosts();

		for(var i:number = 0, max = blogPosts.length; i < max; i++) {

			this.mRouter.AddHandler("!"+blogPosts[i].slug, this.WrapRouterCallback(this.ShowBlogPost));
		}

		this.mProfileModel.AddEventListener(ProfileEvent.SPEAKERS_LOADED, this.OnProfileJSONLoaded, this);
		this.mProfileModel.AddEventListener(ProfileEvent.PARTNERS_LOADED, this.OnProfileJSONLoaded, this);
		this.mProfileModel.AddEventListener(ProfileEvent.VOLUNTEERS_LOADED, this.OnProfileJSONLoaded, this);

		this.mProfileModel.FetchSpeakers();
		this.mProfileModel.FetchPartners();
		this.mProfileModel.FetchVolunteers();
	}

	private ShowBlogPost():void{

		this.ShowBlog();

		var blogController:BlogController = <BlogController>this.mCurrentController;

		blogController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBlogShown, this);

		if(blogController.IsReady()){

			this.OnBlogShown(null);
		}
	}

	private OnBlogShown(aEvent:MVCEvent):void{

		var blogController:BlogController = <BlogController>this.mCurrentController;

		blogController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnBlogShown, this);

		var path:string = window.location.hash.substring(2);

		var blogPosts = this.mBlogModel.GetBlogPosts();

		var blogPost:BlogPost;

		for(var i:number = 0, max = blogPosts.length; i < max; i++){

			if(path == blogPosts[i].slug){

				blogPost = blogPosts[i];
			}
		}

		blogController.OpenArticle(blogPost);
	}

	private OnProfileJSONLoaded(aEvent:ProfileEvent):void{

		var profiles:Array<Profile>;
		var callback:Function;

		if(aEvent.eventName == ProfileEvent.SPEAKERS_LOADED) {

			profiles = this.mProfileModel.GetSpeakers();
			callback = this.ShowSpecificSpeaker;

		} else if(aEvent.eventName == ProfileEvent.PARTNERS_LOADED) {

			profiles = this.mProfileModel.GetPartners();
			callback = this.ShowSpecificPartner;

		} else if(aEvent.eventName == ProfileEvent.VOLUNTEERS_LOADED) {

			profiles = this.mProfileModel.GetVolunteers();
			callback = this.ShowSpecificVolunteer;
		}

		for(var i:number = 0, max = profiles.length; i < max; i++) {
			this.mRouter.AddHandler("!"+profiles[i].slug, this.WrapRouterCallback(callback.bind(this)));
		}

		if(	this.mProfileModel.IsSpeakersLoaded() &&
			this.mProfileModel.IsPartnersLoaded() &&
			this.mProfileModel.IsVolunteersLoaded()){

			this.mProfileModel.RemoveEventListener(ProfileEvent.SPEAKERS_LOADED, this.OnProfileJSONLoaded, this);
			this.mProfileModel.RemoveEventListener(ProfileEvent.PARTNERS_LOADED, this.OnProfileJSONLoaded, this);
			this.mProfileModel.RemoveEventListener(ProfileEvent.VOLUNTEERS_LOADED, this.OnProfileJSONLoaded, this);

			this.mConferenceModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnConferenceJSONLoaded, this);
			this.mConferenceModel.FetchConferences();
		}
	}

	private OnConferenceJSONLoaded(aEvent:MVCEvent):void{

		this.mConferenceModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnConferenceJSONLoaded, this);

		var conferences:Array<Conference> = this.mConferenceModel.GetConferences();

		for(var i:number = 0, max = conferences.length; i < max; i++) {

			if(!conferences[i].break){
				this.mRouter.AddHandler("!"+conferences[i].slug, this.ShowSpecificConference.bind(this));
			}
		}

		this.mRouter.Reload();
	}

	private ShowSpecificConference():void{

		this.ShowSchedule();

		var scheduleController:ScheduleController = <ScheduleController>this.mCurrentController;

		scheduleController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnScheduleShown, this);

		if(scheduleController.IsReady()){

			this.OnScheduleShown(null);
		}
	}

	private OnScheduleShown(aEvent:MVCEvent):void{

		var scheduleController:ScheduleController = <ScheduleController>this.mCurrentController;

		scheduleController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnScheduleShown, this);

		var path:string = window.location.hash.substring(2);

		var conferences:Array<Conference> = this.mConferenceModel.GetConferences();

		var conference:Conference;

		for(var i:number = 0, max = conferences.length; i < max; i++){

			if(path == conferences[i].slug){

				conference = conferences[i];
			}
		}

		scheduleController.ShowConference(conference);
	}

	private ShowSpecificSpeaker():void{

		this.ShowSpeakers();
		this.LoadProfileController();
	}

	private ShowSpecificPartner():void{

		this.ShowPartners();
		this.LoadProfileController();
	}

	private ShowSpecificVolunteer():void{

		this.ShowVolunteers();
		this.LoadProfileController();
	}

	private LoadProfileController():void{

		var profileController:ProfilesController = <ProfilesController>this.mCurrentController;

		profileController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnProfileShown, this);

		if(profileController.IsReady()){

			this.OnProfileShown(null);
		}
	}

	private OnProfileShown(aEvent:MVCEvent):void {

		var profileController:ProfilesController = <ProfilesController>this.mCurrentController;

		profileController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnProfileShown, this);

		var path:string = window.location.hash.substring(2);

		var profiles:Array<Profile> = this.mProfileModel.GetProfiles();

		var profile:Profile;

		for(var i:number = 0, max = profiles.length; i < max; i++){

			if(path == profiles[i].slug){

				profile = profiles[i];
			}
		}

		profileController.ShowProfile(profile);
	}

	private ShowHomeScreen():void {
		this.SetupNavigable("accueil", HomeController);
		this.mHeaderController.OnMenuClose();
	}

	private ShowTickets():void {
		this.SetupNavigable("billets", TicketsController);
	}

	private ShowSchedule():void {
		this.SetupNavigable("horaire", ScheduleController);
	}

	private ShowBlog():void {

		var blogController:BlogController = <BlogController>this.mCurrentController;

		if(this.mCurrentAction == "blogue" && blogController.IsReady()){

			blogController.CloseArticle();
		}

		this.SetupNavigable("blogue", BlogController);
	}

	private ShowSpeakers():void {
		this.SetupNavigable("conferenciers", SpeakerController);
	}

	private ShowVolunteers():void {
		this.SetupNavigable("benevoles", VolunteerController);
	}

	private ShowPartners():void {
		this.SetupNavigable("partenaires", PartnerController);
	}

	private ShowContact():void {
		this.SetupNavigable("contact", ContactController);
	}

	private SetupNavigable(aName:string, aControllerClass:any):void {

		if (this.mAnimationController.IsAnimating) { return };

		EConfig.CURRENT_PATH = aName;

		this.mCurrentAction = (aName == null) ? "" : aName;

		this.mPreviousController = this.mCurrentController;
		this.mCurrentController = new aControllerClass();

		this.mAnimationController.PrepareToAnimateTo(this.GetPageIndex(this.mCurrentAction));
		this.mCurrentController.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	}

	private GetPageIndex(aAction:string):number {

		for (var i:number = 0; i < this.mTotalActions; i++) {

			var currentRoutes:Array<string> = this.mActions[i].routes;

			for (var j:number = 0, totalRoutes:number = currentRoutes.length; j < totalRoutes; j++) {

				if (currentRoutes[j] === "!" + aAction) { return i };
			}
	    }

		return -1;
	}

	private OnNewControllerLoaded():void {

		this.mCurrentController.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);

		this.mAnimationController.AddEventListener(AnimationEvent.ANIMATION_FINISHED, this.OnAnimationFinished, this);
		this.mAnimationController.AnimateContent();
	}

	private OnAnimationFinished():void {

		this.mAnimationController.RemoveEventListener(AnimationEvent.ANIMATION_FINISHED, this.OnAnimationFinished, this);

		this.mPreviousController.Destroy();
		this.mPreviousController = null;
	}
}
/* tslint:disable */
new Main();
/* tslint:enable */
