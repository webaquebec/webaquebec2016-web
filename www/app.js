/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var KeyManager_1 = __webpack_require__(3);
	var MouseSwipeEvent_1 = __webpack_require__(4);
	var MVCEvent_1 = __webpack_require__(6);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var EConfig_1 = __webpack_require__(10);
	var AnimationEvent_1 = __webpack_require__(11);
	var AnimationController_1 = __webpack_require__(12);
	var BlogController_1 = __webpack_require__(13);
	var BlogModel_1 = __webpack_require__(41);
	var ProfilesModel_1 = __webpack_require__(47);
	var ProfileEvent_1 = __webpack_require__(48);
	var ConferenceModel_1 = __webpack_require__(49);
	var ContactController_1 = __webpack_require__(57);
	var HeaderController_1 = __webpack_require__(60);
	var HomeController_1 = __webpack_require__(65);
	var SpeakerController_1 = __webpack_require__(66);
	var PartnerController_1 = __webpack_require__(71);
	var VolunteerController_1 = __webpack_require__(72);
	var ScheduleController_1 = __webpack_require__(73);
	var SwipeController_1 = __webpack_require__(74);
	var TicketsController_1 = __webpack_require__(76);
	var Main = (function (_super) {
	    __extends(Main, _super);
	    function Main() {
	        _super.call(this);
	        this.Init();
	    }
	    Main.prototype.Init = function () {
	        KeyManager_1.default.Register(this);
	        this.mActions = [
	            { routes: ["", "accueil", "home"], callback: this.ShowHomeScreen.bind(this) },
	            { routes: ["billets", "tickets"], callback: this.ShowTickets.bind(this) },
	            { routes: ["horaire", "schedule"], callback: this.ShowSchedule.bind(this) },
	            { routes: ["blogue", "blog"], callback: this.ShowBlog.bind(this) },
	            { routes: ["conferenciers"], callback: this.ShowSpeakers.bind(this) },
	            { routes: ["benevoles"], callback: this.ShowVolunteers.bind(this) },
	            { routes: ["partenaires"], callback: this.ShowPartners.bind(this) },
	            { routes: ["contact"], callback: this.ShowContact.bind(this) }
	        ];
	        this.mTotalActions = this.mActions.length;
	        this.mKeyLeft = false;
	        this.mKeyRight = false;
	        this.mHeaderController = new HeaderController_1.default();
	        this.mAnimationController = new AnimationController_1.default();
	        this.mSwipeController = new SwipeController_1.default();
	        this.mSwipeController.AddEventListener(MouseSwipeEvent_1.default.SWIPE_LEFT, this.OnSwipeLeftEvent, this);
	        this.mSwipeController.AddEventListener(MouseSwipeEvent_1.default.SWIPE_RIGHT, this.OnSwipeRightEvent, this);
	        this.mBlogModel = BlogModel_1.default.GetInstance();
	        this.mProfileModel = ProfilesModel_1.default.GetInstance();
	        this.mConferenceModel = ConferenceModel_1.default.GetInstance();
	        this.mRouter = cortex_toolkit_js_router_1.Router.GetInstance();
	        this.SetupRouting();
	        document.addEventListener("DOMContentLoaded", this.OnContentLoaded.bind(this), false);
	    };
	    Main.prototype.OnContentLoaded = function () {
	        document.removeEventListener("DOMContentLoaded", this.OnContentLoaded.bind(this), false);
	        this.mSwipeController.InitOnElement(Main.CORE_ELEMENT_ID);
	        if (!("ontouchstart" in document.documentElement)) {
	            document.documentElement.className += " no-touch";
	        }
	    };
	    Main.prototype.KeyPressed = function (aKeyList) {
	        if (!this.mKeyLeft && aKeyList.indexOf(Main.KEY_LEFT) != -1) {
	            this.NavigateSideways(-1);
	        }
	        if (!this.mKeyRight && aKeyList.indexOf(Main.KEY_RIGHT) != -1) {
	            this.NavigateSideways(1);
	        }
	        if (!this.mAnimationController.IsAnimating) {
	            this.UpdateKeyStates(aKeyList);
	        }
	    };
	    Main.prototype.KeyReleased = function (aKeyList) {
	        this.UpdateKeyStates(aKeyList);
	    };
	    Main.prototype.UpdateKeyStates = function (aKeyList) {
	        this.mKeyLeft = aKeyList.indexOf(Main.KEY_LEFT) != -1;
	        this.mKeyRight = aKeyList.indexOf(Main.KEY_RIGHT) != -1;
	    };
	    Main.prototype.OnSwipeLeftEvent = function (aEvent) {
	        this.NavigateSideways(-1);
	    };
	    Main.prototype.OnSwipeRightEvent = function (aEvent) {
	        this.NavigateSideways(1);
	    };
	    Main.prototype.NavigateSideways = function (aDirection) {
	        if (this.mAnimationController.IsAnimating) {
	            return;
	        }
	        ;
	        this.mHeaderController.OnMenuClose();
	        var nextPageIndex = this.GetPageIndex(this.mCurrentAction) + aDirection;
	        if (nextPageIndex >= 0 && nextPageIndex < this.mTotalActions) {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(this.mActions[nextPageIndex].routes[0]);
	        }
	    };
	    Main.prototype.SetupRouting = function () {
	        for (var i = 0; i < this.mTotalActions; i++) {
	            var currentAction = this.mActions[i];
	            var currentRoutes = currentAction.routes;
	            for (var j = 0, jMax = currentRoutes.length; j < jMax; j++) {
	                this.mRouter.AddHandler(currentRoutes[j], currentAction.callback);
	            }
	        }
	        this.mBlogModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnBlogJSONLoaded, this);
	        this.mBlogModel.FetchBlogPosts();
	    };
	    Main.prototype.OnBlogJSONLoaded = function (aEvent) {
	        this.mBlogModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnBlogJSONLoaded, this);
	        var blogPosts = this.mBlogModel.GetBlogPosts();
	        for (var i = 0, max = blogPosts.length; i < max; i++) {
	            this.mRouter.AddHandler(blogPosts[i].slug, this.ShowBlogPost.bind(this));
	        }
	        this.mProfileModel.AddEventListener(ProfileEvent_1.default.SPEAKERS_LOADED, this.OnProfileJSONLoaded, this);
	        this.mProfileModel.AddEventListener(ProfileEvent_1.default.PARTNERS_LOADED, this.OnProfileJSONLoaded, this);
	        this.mProfileModel.AddEventListener(ProfileEvent_1.default.VOLUNTEERS_LOADED, this.OnProfileJSONLoaded, this);
	        this.mProfileModel.FetchSpeakers();
	        this.mProfileModel.FetchPartners();
	        this.mProfileModel.FetchVolunteers();
	    };
	    Main.prototype.ShowBlogPost = function () {
	        this.ShowBlog();
	        var blogController = this.mCurrentController;
	        blogController.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnBlogShown, this);
	        if (blogController.IsReady()) {
	            this.OnBlogShown(null);
	        }
	    };
	    Main.prototype.OnBlogShown = function (aEvent) {
	        var blogController = this.mCurrentController;
	        blogController.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnBlogShown, this);
	        var path = window.location.hash.substring(1);
	        var blogPosts = this.mBlogModel.GetBlogPosts();
	        var blogPost;
	        for (var i = 0, max = blogPosts.length; i < max; i++) {
	            if (path == blogPosts[i].slug) {
	                blogPost = blogPosts[i];
	            }
	        }
	        blogController.OpenArticle(blogPost);
	    };
	    Main.prototype.OnProfileJSONLoaded = function (aEvent) {
	        var profiles;
	        var callback;
	        if (aEvent.eventName == ProfileEvent_1.default.SPEAKERS_LOADED) {
	            profiles = this.mProfileModel.GetSpeakers();
	            callback = this.ShowSpecificSpeaker;
	        }
	        else if (aEvent.eventName == ProfileEvent_1.default.PARTNERS_LOADED) {
	            profiles = this.mProfileModel.GetPartners();
	            callback = this.ShowSpecificPartner;
	        }
	        else if (aEvent.eventName == ProfileEvent_1.default.VOLUNTEERS_LOADED) {
	            profiles = this.mProfileModel.GetVolunteers();
	            callback = this.ShowSpecificVolunteer;
	        }
	        for (var i = 0, max = profiles.length; i < max; i++) {
	            this.mRouter.AddHandler(profiles[i].slug, callback.bind(this));
	        }
	        if (this.mProfileModel.IsSpeakersLoaded() &&
	            this.mProfileModel.IsPartnersLoaded() &&
	            this.mProfileModel.IsVolunteersLoaded()) {
	            this.mProfileModel.RemoveEventListener(ProfileEvent_1.default.SPEAKERS_LOADED, this.OnProfileJSONLoaded, this);
	            this.mProfileModel.RemoveEventListener(ProfileEvent_1.default.PARTNERS_LOADED, this.OnProfileJSONLoaded, this);
	            this.mProfileModel.RemoveEventListener(ProfileEvent_1.default.VOLUNTEERS_LOADED, this.OnProfileJSONLoaded, this);
	            this.mConferenceModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnConferenceJSONLoaded, this);
	            this.mConferenceModel.FetchConferences();
	        }
	    };
	    Main.prototype.OnConferenceJSONLoaded = function (aEvent) {
	        this.mConferenceModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnConferenceJSONLoaded, this);
	        var conferences = this.mConferenceModel.GetConferences();
	        for (var i = 0, max = conferences.length; i < max; i++) {
	            this.mRouter.AddHandler(conferences[i].slug, this.ShowSpecificConference.bind(this));
	        }
	        this.mRouter.Reload();
	    };
	    Main.prototype.ShowSpecificConference = function () {
	        this.ShowSchedule();
	        var scheduleController = this.mCurrentController;
	        scheduleController.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnScheduleShown, this);
	        if (scheduleController.IsReady()) {
	            this.OnScheduleShown(null);
	        }
	    };
	    Main.prototype.OnScheduleShown = function (aEvent) {
	        var scheduleController = this.mCurrentController;
	        scheduleController.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnScheduleShown, this);
	        var path = window.location.hash.substring(1);
	        var conferences = this.mConferenceModel.GetConferences();
	        var conference;
	        for (var i = 0, max = conferences.length; i < max; i++) {
	            if (path == conferences[i].slug) {
	                conference = conferences[i];
	            }
	        }
	        scheduleController.ShowConference(conference);
	    };
	    Main.prototype.ShowSpecificSpeaker = function () {
	        this.ShowSpeakers();
	        this.LoadProfileController();
	    };
	    Main.prototype.ShowSpecificPartner = function () {
	        this.ShowPartners();
	        this.LoadProfileController();
	    };
	    Main.prototype.ShowSpecificVolunteer = function () {
	        this.ShowVolunteers();
	        this.LoadProfileController();
	    };
	    Main.prototype.LoadProfileController = function () {
	        var profileController = this.mCurrentController;
	        profileController.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnProfileShown, this);
	        if (profileController.IsReady()) {
	            this.OnProfileShown(null);
	        }
	    };
	    Main.prototype.OnProfileShown = function (aEvent) {
	        var profileController = this.mCurrentController;
	        profileController.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnProfileShown, this);
	        var path = window.location.hash.substring(1);
	        var profiles = this.mProfileModel.GetProfiles();
	        var profile;
	        for (var i = 0, max = profiles.length; i < max; i++) {
	            if (path == profiles[i].slug) {
	                profile = profiles[i];
	            }
	        }
	        profileController.ShowProfile(profile);
	    };
	    Main.prototype.ShowHomeScreen = function () {
	        this.SetupNavigable("accueil", HomeController_1.default);
	        this.mHeaderController.OnMenuClose();
	    };
	    Main.prototype.ShowTickets = function () {
	        this.SetupNavigable("billets", TicketsController_1.default);
	    };
	    Main.prototype.ShowSchedule = function () {
	        this.SetupNavigable("horaire", ScheduleController_1.default);
	    };
	    Main.prototype.ShowBlog = function () {
	        var blogController = this.mCurrentController;
	        if (this.mCurrentAction == "blogue" && blogController.IsReady()) {
	            blogController.CloseArticle();
	        }
	        this.SetupNavigable("blogue", BlogController_1.default);
	    };
	    Main.prototype.ShowSpeakers = function () {
	        this.SetupNavigable("conferenciers", SpeakerController_1.default);
	    };
	    Main.prototype.ShowVolunteers = function () {
	        this.SetupNavigable("benevoles", VolunteerController_1.default);
	    };
	    Main.prototype.ShowPartners = function () {
	        this.SetupNavigable("partenaires", PartnerController_1.default);
	    };
	    Main.prototype.ShowContact = function () {
	        this.SetupNavigable("contact", ContactController_1.default);
	    };
	    Main.prototype.SetupNavigable = function (aName, aControllerClass) {
	        if (aName === this.mCurrentAction || this.mAnimationController.IsAnimating) {
	            return;
	        }
	        ;
	        EConfig_1.default.CURRENT_PATH = aName;
	        this.mCurrentAction = (aName == null) ? "" : aName;
	        this.mPreviousController = this.mCurrentController;
	        this.mCurrentController = new aControllerClass();
	        this.mAnimationController.PrepareToAnimateTo(this.GetPageIndex(this.mCurrentAction));
	        this.mCurrentController.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	    };
	    Main.prototype.GetPageIndex = function (aAction) {
	        for (var i = 0; i < this.mTotalActions; i++) {
	            var currentRoutes = this.mActions[i].routes;
	            for (var j = 0, totalRoutes = currentRoutes.length; j < totalRoutes; j++) {
	                if (currentRoutes[j] === aAction) {
	                    return i;
	                }
	                ;
	            }
	        }
	        return -1;
	    };
	    Main.prototype.OnNewControllerLoaded = function () {
	        this.mCurrentController.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	        this.mAnimationController.AddEventListener(AnimationEvent_1.default.ANIMATION_FINISHED, this.OnAnimationFinished, this);
	        this.mAnimationController.AnimateContent();
	    };
	    Main.prototype.OnAnimationFinished = function () {
	        this.mAnimationController.RemoveEventListener(AnimationEvent_1.default.ANIMATION_FINISHED, this.OnAnimationFinished, this);
	        this.mPreviousController.Destroy();
	        this.mPreviousController = null;
	    };
	    Main.KEY_LEFT = 37;
	    Main.KEY_RIGHT = 39;
	    Main.CORE_ELEMENT_ID = "core";
	    return Main;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Main;
	new Main();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var EventGroup_1 = __webpack_require__(2);
	var EventDispatcher = (function () {
	    function EventDispatcher() {
	        this.mListenerDictionary = {};
	    }
	    EventDispatcher.prototype.Destroy = function () {
	        this.mListenerDictionary = undefined;
	    };
	    EventDispatcher.prototype.HasEventListener = function (aEventName) {
	        return (this.mListenerDictionary[aEventName] != null);
	    };
	    EventDispatcher.prototype.AddEventListener = function (aEventName, aCallback, aScope) {
	        if (this.mListenerDictionary[aEventName] == null) {
	            this.mListenerDictionary[aEventName] = new EventGroup_1.default();
	        }
	        if (!this.mListenerDictionary[aEventName].Exist(aCallback, aScope)) {
	            this.mListenerDictionary[aEventName].Add(aCallback, aScope);
	        }
	    };
	    EventDispatcher.prototype.RemoveEventListener = function (aEventName, aCallback, aScope) {
	        if (!this.HasEventListener(aEventName)) {
	            return;
	        }
	        var callbackIndex = this.mListenerDictionary[aEventName].Find(aCallback, aScope);
	        if (callbackIndex >= 0) {
	            this.mListenerDictionary[aEventName].Remove(callbackIndex);
	        }
	        if (this.mListenerDictionary[aEventName].Empty()) {
	            this.mListenerDictionary[aEventName].Destroy();
	            this.mListenerDictionary[aEventName] = undefined;
	        }
	    };
	    EventDispatcher.prototype.DispatchEvent = function (aEvent) {
	        if (this.mListenerDictionary[aEvent.eventName] != null) {
	            aEvent.target = this;
	            this.mListenerDictionary[aEvent.eventName].FireEvent(aEvent);
	        }
	    };
	    return EventDispatcher;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventDispatcher;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var EventGroup = (function () {
	    function EventGroup() {
	        this.mCallbackList = new Array();
	    }
	    EventGroup.prototype.Destroy = function () {
	        this.mCallbackList.splice(0, this.mCallbackList.length);
	        this.mCallbackList = null;
	    };
	    EventGroup.prototype.Add = function (aCallback, aScope) {
	        this.mCallbackList.push({
	            callback: aCallback,
	            scope: aScope
	        });
	    };
	    EventGroup.prototype.Remove = function (aIndex) {
	        this.mCallbackList.splice(aIndex, 1);
	    };
	    EventGroup.prototype.Find = function (aCallback, aScope) {
	        var index = -1;
	        var callbackListLength = this.mCallbackList.length;
	        for (var i = 0; i < callbackListLength; i++) {
	            var callbackObject = this.mCallbackList[i];
	            if ("" + callbackObject.callback === "" + aCallback && callbackObject.scope === aScope) {
	                index = i;
	                break;
	            }
	        }
	        return (index);
	    };
	    EventGroup.prototype.Exist = function (aCallback, aScope) {
	        return (this.Find(aCallback, aScope) >= 0);
	    };
	    EventGroup.prototype.Empty = function () { return (this.mCallbackList.length <= 0); };
	    EventGroup.prototype.FireEvent = function (aEvent) {
	        var callbackListLength = this.mCallbackList == null ? 0 : this.mCallbackList.length;
	        for (var i = callbackListLength - 1; i >= 0; i--) {
	            this.mCallbackList[i].callback.apply(this.mCallbackList[i].scope, [aEvent]);
	        }
	    };
	    return EventGroup;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventGroup;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var KeyManager = (function () {
	    function KeyManager() {
	    }
	    KeyManager.Register = function (aKeyBindable) {
	        if (!this.mInitialize) {
	            document.addEventListener("keydown", this.OnKeyDown.bind(this));
	            document.addEventListener("keyup", this.OnKeyUp.bind(this));
	            this.mInitialize = true;
	        }
	        if (this.mKeyBindableList.indexOf(aKeyBindable) >= 0) {
	            return;
	        }
	        this.mKeyBindableList.push(aKeyBindable);
	        this.mListLength++;
	    };
	    KeyManager.Unregister = function (aKeyBindable) {
	        var keyBindableIndex = this.mKeyBindableList.indexOf(aKeyBindable);
	        if (keyBindableIndex <= -1) {
	            return;
	        }
	        this.mKeyBindableList.splice(keyBindableIndex, 1);
	        this.mListLength--;
	        if (this.mListLength == 0) {
	            document.removeEventListener("keydown", this.OnKeyDown.bind(this));
	            document.removeEventListener("keyup", this.OnKeyUp.bind(this));
	        }
	    };
	    KeyManager.OnKeyDown = function (aEvent) {
	        var keyListIndex = this.mKeyList.indexOf(aEvent.keyCode);
	        if (keyListIndex >= 0) {
	            return;
	        }
	        this.mKeyList.push(aEvent.keyCode);
	        var keyBindableListLength = this.mKeyBindableList.length;
	        for (var i = 0; i < keyBindableListLength; i++) {
	            this.mKeyBindableList[i].KeyPressed(this.mKeyList);
	        }
	    };
	    KeyManager.OnKeyUp = function (aEvent) {
	        var keyListIndex = this.mKeyList.indexOf(aEvent.keyCode);
	        this.mKeyList.splice(keyListIndex, 1);
	        var keyBindableListLength = this.mKeyBindableList.length;
	        for (var i = 0; i < keyBindableListLength; i++) {
	            this.mKeyBindableList[i].KeyReleased(this.mKeyList);
	        }
	    };
	    KeyManager.mListLength = 0;
	    KeyManager.mKeyList = [];
	    KeyManager.mKeyBindableList = [];
	    return KeyManager;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = KeyManager;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var MouseSwipeEvent = (function (_super) {
	    __extends(MouseSwipeEvent, _super);
	    function MouseSwipeEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    Object.defineProperty(MouseSwipeEvent.prototype, "locationX", {
	        get: function () { return this.mLocationX; },
	        set: function (aLocationX) { this.mLocationX = aLocationX; },
	        enumerable: true,
	        configurable: true
	    });
	    MouseSwipeEvent.SWIPE_BEGIN = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_BEGIN";
	    MouseSwipeEvent.SWIPE_MOVE = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_MOVE";
	    MouseSwipeEvent.SWIPE_END = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_END";
	    MouseSwipeEvent.SWIPE_LEFT = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_LEFT";
	    MouseSwipeEvent.SWIPE_RIGHT = "com.cortex.core.mouse.event.MouseSwipeEvent::SWIPE_RIGHT";
	    return MouseSwipeEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MouseSwipeEvent;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Event = (function () {
	    function Event(aEventName, aBubble, aCancellable) {
	        if (aBubble === void 0) { aBubble = true; }
	        if (aCancellable === void 0) { aCancellable = false; }
	        this.eventName = aEventName;
	        this.bubble = aBubble;
	        this.cancellable = aCancellable;
	    }
	    return Event;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Event;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var MVCEvent = (function (_super) {
	    __extends(MVCEvent, _super);
	    function MVCEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    MVCEvent.TEMPLATE_LOADED = "com.cortex.core.mvc.event.MVCEvent::TEMPLATE_LOADED";
	    MVCEvent.JSON_LOADED = "com.cortex.core.mvc.event.MVCEvent::JSON_LOADED";
	    return MVCEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MVCEvent;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// Export stuff from sub modules
	var Route_1 = __webpack_require__(8);
	exports.Route = Route_1.default;
	var Router_1 = __webpack_require__(9);
	exports.Router = Router_1.default;


/***/ },
/* 8 */
/***/ function(module, exports) {

	var Route = (function () {
	    function Route(aPath, aName) {
	        this.mCallbacksLength = 0;
	        this.mName = aName;
	        this.mPath = aPath;
	        this.mKeys = new Array();
	        this.mCallbacks = new Array();
	        this.mParams = {};
	        this.mRegex = this.PathToRegExp(this.mPath, this.mKeys, false, false);
	    }
	    Route.prototype.AddHandler = function (aCallback) {
	        this.mCallbacks.push(aCallback);
	        ++this.mCallbacksLength;
	    };
	    Route.prototype.RemoveHandler = function (aCallback) {
	        for (var i = 0; i < this.mCallbacksLength; i++) {
	            var callback = this.mCallbacks[i];
	            if (aCallback == callback) {
	                this.mCallbacks.splice(i, 1);
	                --this.mCallbacksLength;
	                return;
	            }
	        }
	    };
	    Object.defineProperty(Route.prototype, "Path", {
	        get: function () { return this.mPath; },
	        enumerable: true,
	        configurable: true
	    });
	    Route.prototype.Run = function (params) {
	        for (var i = 0, c = this.mCallbacks.length; i < c; i++) {
	            this.mCallbacks[i].apply(this, params);
	        }
	    };
	    Route.prototype.Match = function (aPath, aParams) {
	        var execArray = this.mRegex.exec(aPath);
	        if (!execArray) {
	            return false;
	        }
	        for (var i = 1, len = execArray.length; i < len; ++i) {
	            var key = this.mKeys[i - 1];
	            var value = ("string" == typeof execArray[i]) ? decodeURIComponent(execArray[i]) : execArray[i];
	            if (key) {
	                this.mParams[key.name] = value;
	            }
	            aParams.push(value);
	        }
	        return true;
	    };
	    Route.prototype.ToURL = function (params) {
	        var path = this.mPath;
	        for (var param in params) {
	            if (params[param]) {
	                path = path.replace("/:" + param, "/" + params[param]);
	            }
	        }
	        path = path.replace(/\/:.*\?/g, "/").replace(/\?/g, "");
	        if (path.indexOf(":") != -1) {
	            throw new Error("missing parameters for url: " + path);
	        }
	        return path;
	    };
	    Route.prototype.PathToRegExp = function (aPath, aKeys, aSensitive, aStrict) {
	        if (aPath instanceof RegExp) {
	            return aPath;
	        }
	        if (aPath instanceof Array) {
	            aPath = "(" + aPath.join("|") + ")";
	        }
	        aPath = aPath
	            .concat(aStrict ? "" : "/?")
	            .replace(/\/\(/g, "(?:/")
	            .replace(/\+/g, "__plus__")
	            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
	            aKeys.push({ name: key, optional: !!optional });
	            slash = slash || "";
	            return "" + (optional ? "" : slash) + "(?:" +
	                (optional ? slash : "") +
	                (format || "") +
	                (capture || (format && "([^/.]+?)" || "([^/]+?)")) + ")" +
	                (optional || "");
	        })
	            .replace(/([\/.])/g, "\\$1")
	            .replace(/__plus__/g, "(.+)")
	            .replace(/\*/g, "(.*)");
	        return new RegExp("^" + aPath + "$", aSensitive ? "" : "i");
	    };
	    return Route;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Route;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Route_1 = __webpack_require__(8);
	var Router = (function () {
	    function Router() {
	        this.mRoutes = new Array();
	        this.mMap = {};
	        this.AddListener();
	        window[Router.REFERENCE] = this;
	    }
	    Router.GetInstance = function () {
	        if (Router.mInstance == null) {
	            Router.mInstance = new Router();
	        }
	        return Router.mInstance;
	    };
	    Router.prototype.AddHandler = function (aPath, aCallback) {
	        var s = aPath.split(" ");
	        var name = (s.length == 2) ? s[0] : null;
	        aPath = (s.length == 2) ? s[1] : s[0];
	        if (!this.mMap[aPath]) {
	            this.mMap[aPath] = new Route_1.default(aPath, name);
	            this.mRoutes.push(this.mMap[aPath]);
	        }
	        this.mMap[aPath].AddHandler(aCallback);
	    };
	    Router.prototype.Remove = function (aPath, aCallback) {
	        var route = this.mMap[aPath];
	        if (!route) {
	            return;
	        }
	        route.RemoveHandler(aCallback);
	    };
	    Router.prototype.RemoveAll = function () {
	        this.mMap = {};
	        this.mRoutes = [];
	    };
	    Router.prototype.Navigate = function (aPath, aSilent) {
	        if (aSilent === void 0) { aSilent = false; }
	        if (aSilent) {
	            this.RemoveListener();
	        }
	        setTimeout(function () {
	            window.location.hash = aPath;
	            if (aSilent) {
	                setTimeout(function () {
	                    this.AddListener();
	                }, 1);
	            }
	        }, 1);
	    };
	    Router.prototype.GetHash = function () {
	        return window.location.hash.substring(1);
	    };
	    Router.prototype.CheckRoute = function (aHash, aRoute) {
	        var params = [];
	        if (aRoute.Match(aHash, params)) {
	            aRoute.Run(params);
	            return true;
	        }
	        return false;
	    };
	    Router.prototype.Reload = function () {
	        var hash = this.GetHash();
	        for (var i = 0, c = this.mRoutes.length; i < c; i++) {
	            var route = this.mRoutes[i];
	            if (this.CheckRoute(hash, route)) {
	                return;
	            }
	        }
	    };
	    Router.prototype.AddListener = function () {
	        if (window.addEventListener) {
	            window.addEventListener("hashchange", this.Reload.bind(this), false);
	        }
	        else {
	            window["attachEvent"]("onhashchange", this.Reload.bind(this));
	        }
	    };
	    Router.prototype.RemoveListener = function () {
	        if (window.removeEventListener) {
	            window.removeEventListener("hashchange", this.Reload.bind(this));
	        }
	        else {
	            window["detachEvent"]("onhashchange", this.Reload.bind(this));
	        }
	    };
	    Router.REFERENCE = "routie";
	    return Router;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Router;


/***/ },
/* 10 */
/***/ function(module, exports) {

	var Econfig = (function () {
	    function Econfig() {
	    }
	    Econfig.BASE_URL = "http://dev.webaquebec.org/wp-json/wp/v2/";
	    Econfig.CUSTOM_URL = "http://dev.webaquebec.org/api/";
	    Econfig.PER_PAGE = 200;
	    Econfig.CURRENT_PATH = "";
	    return Econfig;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Econfig;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var AnimationEvent = (function (_super) {
	    __extends(AnimationEvent, _super);
	    function AnimationEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    AnimationEvent.ANIMATION_FINISHED = "com.cortex.waq.animation.event.AnimationEvent::ANIMATION_FINISHED";
	    return AnimationEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AnimationEvent;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var AnimationEvent_1 = __webpack_require__(11);
	var AnimationController = (function (_super) {
	    __extends(AnimationController, _super);
	    function AnimationController() {
	        _super.call(this);
	        this.Init();
	    }
	    AnimationController.prototype.Init = function () {
	        this.mIndexCurrent = -1;
	        this.mIndexNext = -1;
	        this.mSwipeDirection = -1;
	        this.mIsAnimating = false;
	    };
	    Object.defineProperty(AnimationController.prototype, "IsAnimating", {
	        get: function () {
	            return this.mIsAnimating;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    AnimationController.prototype.GetContentLoading = function () {
	        return document.getElementById(AnimationController.mIdLoading);
	    };
	    AnimationController.prototype.GetContentCurrent = function () {
	        return document.getElementById(AnimationController.mIdCurrent);
	    };
	    AnimationController.prototype.SwapContentIds = function () {
	        var contentLoading = this.GetContentLoading();
	        var contentCurrent = this.GetContentCurrent();
	        contentLoading.id = AnimationController.mIdCurrent;
	        contentCurrent.id = AnimationController.mIdLoading;
	    };
	    AnimationController.prototype.PrepareToAnimateTo = function (aNext) {
	        this.mIndexNext = aNext;
	        this.mSwipeDirection = this.mIndexNext - this.mIndexCurrent;
	        this.PositionLoaderDiv();
	        this.mIsAnimating = true;
	    };
	    AnimationController.prototype.PositionLoaderDiv = function () {
	        var contentLoading = this.GetContentLoading();
	        if (contentLoading != null && this.mIndexCurrent != -1) {
	            contentLoading.style.webkitTransform = this.mSwipeDirection > 0 ? "translateX(100%)" : "translateX(-100%)";
	            contentLoading.style.transform = this.mSwipeDirection > 0 ? "translateX(100%)" : "translateX(-100%)";
	        }
	    };
	    AnimationController.prototype.AnimateContent = function () {
	        if (this.mIndexCurrent == -1) {
	            this.SwapContentIds();
	            this.mIsAnimating = false;
	        }
	        else {
	            window.setTimeout(this.TriggerAnimation.bind(this), 50);
	        }
	        this.mIndexCurrent = this.mIndexNext;
	    };
	    AnimationController.prototype.TriggerAnimation = function () {
	        var contentCurrent = this.GetContentCurrent();
	        var contentLoading = this.GetContentLoading();
	        contentCurrent.className = "animated";
	        contentLoading.className = "animated";
	        contentCurrent.style.webkitTransform = this.mSwipeDirection > 0 ? "translateX(-100%)" : "translateX(100%)";
	        contentLoading.style.webkitTransform = "translateX(0)";
	        contentCurrent.style.transform = this.mSwipeDirection > 0 ? "translateX(-100%)" : "translateX(100%)";
	        contentLoading.style.transform = "translateX(0)";
	        window.setTimeout(this.FinishControllerTransition.bind(this), 300);
	    };
	    AnimationController.prototype.FinishControllerTransition = function () {
	        this.DispatchEvent(new AnimationEvent_1.default(AnimationEvent_1.default.ANIMATION_FINISHED));
	        this.mIsAnimating = false;
	        var contentCurrent = this.GetContentCurrent();
	        var contentLoading = this.GetContentLoading();
	        contentCurrent.className = "";
	        contentLoading.className = "";
	        this.SwapContentIds();
	    };
	    AnimationController.mIdCurrent = "content-current";
	    AnimationController.mIdLoading = "content-loading";
	    return AnimationController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AnimationController;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Masonry, ImagesLoaded) {var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentEvent_1 = __webpack_require__(29);
	var ListComponent_1 = __webpack_require__(30);
	var ComponentBinding_1 = __webpack_require__(31);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MVCEvent_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(33);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var BlogModel_1 = __webpack_require__(41);
	var BlogController = (function (_super) {
	    __extends(BlogController, _super);
	    function BlogController() {
	        _super.call(this);
	        this.Init();
	    }
	    BlogController.prototype.Init = function () {
	        this.mBlogModel = BlogModel_1.default.GetInstance();
	        this.mBlogModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	        this.mBlogPosts = this.mBlogModel.GetBlogPosts();
	        if (this.mBlogPosts.length > 0) {
	            this.OnJSONLoaded(null);
	        }
	        this.mTotalBlogPosts = 0;
	    };
	    BlogController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("blog-view");
	        document.getElementById("content-current").removeChild(scheduleHTMLElement);
	        if (this.mBlogPostView) {
	            this.mBlogPostView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnPostTemplateLoaded, this);
	            this.mBlogPostView.Destroy();
	        }
	        this.mBlogPostView = null;
	        this.mListComponent.RemoveEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.AllItemsReady, this);
	        this.mListComponent.Destroy();
	        this.mListComponent = null;
	        this.mBlogView.RemoveEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mBlogView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mBlogView.Destroy();
	        this.mBlogView = null;
	        this.mBlogModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	        this.mBlogModel = null;
	        this.mReady = false;
	        this.mBlogPosts.length = 0;
	        this.mBlogPosts = null;
	        this.mCurrentBlogPost = null;
	    };
	    BlogController.prototype.OnJSONLoaded = function (aEvent) {
	        this.mBlogModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	        this.mBlogView = new AbstractView_1.default();
	        this.mBlogView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mBlogView.LoadTemplate("templates/blog/blog.html");
	    };
	    BlogController.prototype.OnTemplateLoaded = function (aEvent) {
	        this.mBlogView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        document.getElementById("content-loading").innerHTML += this.mBlogView.RenderTemplate({});
	        this.mBlogView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mListComponent = new ListComponent_1.default();
	        this.mListComponent.Init("blog-grid");
	        this.CreateBlogPosts();
	    };
	    BlogController.prototype.IsReady = function () { return this.mReady; };
	    BlogController.prototype.CreateBlogPosts = function () {
	        this.mBlogPosts = this.mBlogModel.GetBlogPosts();
	        this.mTotalBlogPosts = this.mBlogPosts.length;
	        for (var i = 0; i < this.mTotalBlogPosts; i++) {
	            this.mListComponent.AddComponent(new ComponentBinding_1.default(new AbstractView_1.default(), this.mBlogPosts[i]));
	        }
	        this.mListComponent.AddEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.AllItemsReady, this);
	        this.mListComponent.LoadWithTemplate("templates/blog/blogCell.html");
	        this.mReady = true;
	    };
	    BlogController.prototype.AllItemsReady = function () {
	        this.mListComponent.RemoveEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.AllItemsReady, this);
	        for (var i = 0; i < this.mTotalBlogPosts; i++) {
	            this.mBlogView.AddClickControl(document.getElementById("blog-cell-" + i.toString()));
	        }
	        this.LayoutBlogPosts();
	    };
	    BlogController.prototype.LayoutBlogPosts = function () {
	        var grid = document.getElementById("blog-grid");
	        var masonry = new Masonry(grid, { itemSelector: ".blog-cell" });
	        ImagesLoaded(grid, function () {
	            masonry.layout();
	        });
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    BlogController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id === "article-return") {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate("blogue");
	        }
	        else if (element.id.indexOf("blog-cell-") >= 0) {
	            var cellId = element.id.split("blog-cell-")[1];
	            var blogPost = this.mListComponent.GetDataByID(cellId);
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(blogPost.slug);
	        }
	        else if (element.id === "article-prev") {
	            this.LoadPreviousBlogPost();
	        }
	        else if (element.id === "article-next") {
	            this.LoadNextBlogPost();
	        }
	        else if (element.id === "article-tw") {
	            this.ShareTwitter();
	        }
	        else if (element.id === "article-fb") {
	            this.ShareFacebook();
	        }
	        else if (element.id === "article-li") {
	            this.ShareLinkedin();
	        }
	    };
	    BlogController.prototype.ShareTwitter = function () {
	        window.open("https://twitter.com/share?text=" + encodeURIComponent("Blog genial du WAQ!") +
	            "&url=" + encodeURIComponent(window.location.href) +
	            "&hashtags=WAQ2016,WAQ");
	    };
	    BlogController.prototype.ShareFacebook = function () {
	        console.log(window.location);
	        FB.ui({
	            method: "share",
	            href: window.location.href,
	            name: this.mCurrentBlogPost.title,
	            caption: this.mCurrentBlogPost.title,
	            description: this.mCurrentBlogPost.title
	        }, function (response) {
	            console.log(response);
	        });
	    };
	    BlogController.prototype.ShareLinkedin = function () {
	        window.open("https://www.linkedin.com/shareArticle?mini=true" +
	            "&url=" + encodeURIComponent(window.location.href) +
	            "&summary=" + encodeURIComponent("Blog genial du WAQ!") +
	            "&source=LinkedIn");
	    };
	    BlogController.prototype.LoadPreviousBlogPost = function () {
	        var blogPostIndex = this.mBlogPosts.indexOf(this.mCurrentBlogPost);
	        if (blogPostIndex == 0) {
	            return;
	        }
	        cortex_toolkit_js_router_1.Router.GetInstance().Navigate(this.mBlogPosts[blogPostIndex - 1].slug);
	    };
	    BlogController.prototype.LoadNextBlogPost = function () {
	        var blogPostIndex = this.mBlogPosts.indexOf(this.mCurrentBlogPost);
	        if (blogPostIndex == this.mBlogPosts.length - 1) {
	            return;
	        }
	        cortex_toolkit_js_router_1.Router.GetInstance().Navigate(this.mBlogPosts[blogPostIndex + 1].slug);
	    };
	    BlogController.prototype.OpenArticle = function (aBlogPost) {
	        this.mCurrentBlogPost = aBlogPost;
	        this.mBlogPostView = new AbstractView_1.default();
	        this.mBlogPostView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnPostTemplateLoaded, this);
	        this.mBlogPostView.LoadTemplate("templates/blog/blogPost.html");
	    };
	    BlogController.prototype.OnPostTemplateLoaded = function (aEvent) {
	        this.mBlogPostView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnPostTemplateLoaded, this);
	        var blogPostElement = document.getElementById("blog-view-article");
	        blogPostElement.innerHTML += this.mBlogPostView.RenderTemplate(this.mCurrentBlogPost);
	        blogPostElement.className = "blog-split blog-split-visible";
	        this.mBlogView.AddClickControl(document.getElementById("article-return"));
	        this.mBlogView.AddClickControl(document.getElementById("article-prev"));
	        this.mBlogView.AddClickControl(document.getElementById("article-next"));
	        this.mBlogView.AddClickControl(document.getElementById("article-tw"));
	        this.mBlogView.AddClickControl(document.getElementById("article-fb"));
	        this.mBlogView.AddClickControl(document.getElementById("article-li"));
	        document.getElementById("article-title-el").innerHTML = this.mCurrentBlogPost.title;
	        document.getElementById("article-text").innerHTML = this.mCurrentBlogPost.text;
	    };
	    BlogController.prototype.CloseArticle = function () {
	        document.getElementById("blog-view-article").className = "blog-split blog-split-hidden";
	        var blogPostElement = document.getElementById("blog-view-article");
	        blogPostElement.innerHTML = "";
	        if (this.mBlogPostView) {
	            this.mBlogPostView.Destroy();
	        }
	        this.mBlogPostView = null;
	    };
	    return BlogController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BlogController;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14), __webpack_require__(26)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * Masonry v3.3.2
	 * Cascading grid layout library
	 * http://masonry.desandro.com
	 * MIT License
	 * by David DeSandro
	 */

	( function( window, factory ) {
	  'use strict';
	  // universal module definition
	  if ( typeof define === 'function' && define.amd ) {
	    // AMD
	    define( [
	        'outlayer/outlayer',
	        'get-size/get-size',
	        'fizzy-ui-utils/utils'
	      ],
	      factory );
	  } else if ( true ) {
	    // CommonJS
	    module.exports = factory(
	      __webpack_require__(15),
	      __webpack_require__(18),
	      __webpack_require__(20)
	    );
	  } else {
	    // browser global
	    window.Masonry = factory(
	      window.Outlayer,
	      window.getSize,
	      window.fizzyUIUtils
	    );
	  }

	}( window, function factory( Outlayer, getSize, utils ) {

	'use strict';

	// -------------------------- masonryDefinition -------------------------- //

	  // create an Outlayer layout class
	  var Masonry = Outlayer.create('masonry');

	  Masonry.prototype._resetLayout = function() {
	    this.getSize();
	    this._getMeasurement( 'columnWidth', 'outerWidth' );
	    this._getMeasurement( 'gutter', 'outerWidth' );
	    this.measureColumns();

	    // reset column Y
	    var i = this.cols;
	    this.colYs = [];
	    while (i--) {
	      this.colYs.push( 0 );
	    }

	    this.maxY = 0;
	  };

	  Masonry.prototype.measureColumns = function() {
	    this.getContainerWidth();
	    // if columnWidth is 0, default to outerWidth of first item
	    if ( !this.columnWidth ) {
	      var firstItem = this.items[0];
	      var firstItemElem = firstItem && firstItem.element;
	      // columnWidth fall back to item of first element
	      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
	        // if first elem has no width, default to size of container
	        this.containerWidth;
	    }

	    var columnWidth = this.columnWidth += this.gutter;

	    // calculate columns
	    var containerWidth = this.containerWidth + this.gutter;
	    var cols = containerWidth / columnWidth;
	    // fix rounding errors, typically with gutters
	    var excess = columnWidth - containerWidth % columnWidth;
	    // if overshoot is less than a pixel, round up, otherwise floor it
	    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
	    cols = Math[ mathMethod ]( cols );
	    this.cols = Math.max( cols, 1 );
	  };

	  Masonry.prototype.getContainerWidth = function() {
	    // container is parent if fit width
	    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
	    // check that this.size and size are there
	    // IE8 triggers resize on body size change, so they might not be
	    var size = getSize( container );
	    this.containerWidth = size && size.innerWidth;
	  };

	  Masonry.prototype._getItemLayoutPosition = function( item ) {
	    item.getSize();
	    // how many columns does this brick span
	    var remainder = item.size.outerWidth % this.columnWidth;
	    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
	    // round if off by 1 pixel, otherwise use ceil
	    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
	    colSpan = Math.min( colSpan, this.cols );

	    var colGroup = this._getColGroup( colSpan );
	    // get the minimum Y value from the columns
	    var minimumY = Math.min.apply( Math, colGroup );
	    var shortColIndex = utils.indexOf( colGroup, minimumY );

	    // position the brick
	    var position = {
	      x: this.columnWidth * shortColIndex,
	      y: minimumY
	    };

	    // apply setHeight to necessary columns
	    var setHeight = minimumY + item.size.outerHeight;
	    var setSpan = this.cols + 1 - colGroup.length;
	    for ( var i = 0; i < setSpan; i++ ) {
	      this.colYs[ shortColIndex + i ] = setHeight;
	    }

	    return position;
	  };

	  /**
	   * @param {Number} colSpan - number of columns the element spans
	   * @returns {Array} colGroup
	   */
	  Masonry.prototype._getColGroup = function( colSpan ) {
	    if ( colSpan < 2 ) {
	      // if brick spans only one column, use all the column Ys
	      return this.colYs;
	    }

	    var colGroup = [];
	    // how many different places could this brick fit horizontally
	    var groupCount = this.cols + 1 - colSpan;
	    // for each group potential horizontal position
	    for ( var i = 0; i < groupCount; i++ ) {
	      // make an array of colY values for that one group
	      var groupColYs = this.colYs.slice( i, i + colSpan );
	      // and get the max value of the array
	      colGroup[i] = Math.max.apply( Math, groupColYs );
	    }
	    return colGroup;
	  };

	  Masonry.prototype._manageStamp = function( stamp ) {
	    var stampSize = getSize( stamp );
	    var offset = this._getElementOffset( stamp );
	    // get the columns that this stamp affects
	    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
	    var lastX = firstX + stampSize.outerWidth;
	    var firstCol = Math.floor( firstX / this.columnWidth );
	    firstCol = Math.max( 0, firstCol );
	    var lastCol = Math.floor( lastX / this.columnWidth );
	    // lastCol should not go over if multiple of columnWidth #425
	    lastCol -= lastX % this.columnWidth ? 0 : 1;
	    lastCol = Math.min( this.cols - 1, lastCol );
	    // set colYs to bottom of the stamp
	    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
	      stampSize.outerHeight;
	    for ( var i = firstCol; i <= lastCol; i++ ) {
	      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
	    }
	  };

	  Masonry.prototype._getContainerSize = function() {
	    this.maxY = Math.max.apply( Math, this.colYs );
	    var size = {
	      height: this.maxY
	    };

	    if ( this.options.isFitWidth ) {
	      size.width = this._getContainerFitWidth();
	    }

	    return size;
	  };

	  Masonry.prototype._getContainerFitWidth = function() {
	    var unusedCols = 0;
	    // count unused columns
	    var i = this.cols;
	    while ( --i ) {
	      if ( this.colYs[i] !== 0 ) {
	        break;
	      }
	      unusedCols++;
	    }
	    // fit container to columns that have been used
	    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
	  };

	  Masonry.prototype.needsResizeLayout = function() {
	    var previousWidth = this.containerWidth;
	    this.getContainerWidth();
	    return previousWidth !== this.containerWidth;
	  };

	  return Masonry;

	}));

	}.call(window));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * Outlayer v1.4.2
	 * the brains and guts of a layout library
	 * MIT license
	 */

	( function( window, factory ) {
	  'use strict';
	  // universal module definition

	  if ( typeof define == 'function' && define.amd ) {
	    // AMD
	    define( [
	        'eventie/eventie',
	        'eventEmitter/EventEmitter',
	        'get-size/get-size',
	        'fizzy-ui-utils/utils',
	        './item'
	      ],
	      function( eventie, EventEmitter, getSize, utils, Item ) {
	        return factory( window, eventie, EventEmitter, getSize, utils, Item);
	      }
	    );
	  } else if ( true ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      __webpack_require__(16),
	      __webpack_require__(17),
	      __webpack_require__(18),
	      __webpack_require__(20),
	      __webpack_require__(24)
	    );
	  } else {
	    // browser global
	    window.Outlayer = factory(
	      window,
	      window.eventie,
	      window.EventEmitter,
	      window.getSize,
	      window.fizzyUIUtils,
	      window.Outlayer.Item
	    );
	  }

	}( window, function factory( window, eventie, EventEmitter, getSize, utils, Item ) {
	'use strict';

	// ----- vars ----- //

	var console = window.console;
	var jQuery = window.jQuery;
	var noop = function() {};

	// -------------------------- Outlayer -------------------------- //

	// globally unique identifiers
	var GUID = 0;
	// internal store of all Outlayer intances
	var instances = {};


	/**
	 * @param {Element, String} element
	 * @param {Object} options
	 * @constructor
	 */
	function Outlayer( element, options ) {
	  var queryElement = utils.getQueryElement( element );
	  if ( !queryElement ) {
	    if ( console ) {
	      console.error( 'Bad element for ' + this.constructor.namespace +
	        ': ' + ( queryElement || element ) );
	    }
	    return;
	  }
	  this.element = queryElement;
	  // add jQuery
	  if ( jQuery ) {
	    this.$element = jQuery( this.element );
	  }

	  // options
	  this.options = utils.extend( {}, this.constructor.defaults );
	  this.option( options );

	  // add id for Outlayer.getFromElement
	  var id = ++GUID;
	  this.element.outlayerGUID = id; // expando
	  instances[ id ] = this; // associate via id

	  // kick it off
	  this._create();

	  if ( this.options.isInitLayout ) {
	    this.layout();
	  }
	}

	// settings are for internal use only
	Outlayer.namespace = 'outlayer';
	Outlayer.Item = Item;

	// default options
	Outlayer.defaults = {
	  containerStyle: {
	    position: 'relative'
	  },
	  isInitLayout: true,
	  isOriginLeft: true,
	  isOriginTop: true,
	  isResizeBound: true,
	  isResizingContainer: true,
	  // item options
	  transitionDuration: '0.4s',
	  hiddenStyle: {
	    opacity: 0,
	    transform: 'scale(0.001)'
	  },
	  visibleStyle: {
	    opacity: 1,
	    transform: 'scale(1)'
	  }
	};

	// inherit EventEmitter
	utils.extend( Outlayer.prototype, EventEmitter.prototype );

	/**
	 * set options
	 * @param {Object} opts
	 */
	Outlayer.prototype.option = function( opts ) {
	  utils.extend( this.options, opts );
	};

	Outlayer.prototype._create = function() {
	  // get items from children
	  this.reloadItems();
	  // elements that affect layout, but are not laid out
	  this.stamps = [];
	  this.stamp( this.options.stamp );
	  // set container style
	  utils.extend( this.element.style, this.options.containerStyle );

	  // bind resize method
	  if ( this.options.isResizeBound ) {
	    this.bindResize();
	  }
	};

	// goes through all children again and gets bricks in proper order
	Outlayer.prototype.reloadItems = function() {
	  // collection of item elements
	  this.items = this._itemize( this.element.children );
	};


	/**
	 * turn elements into Outlayer.Items to be used in layout
	 * @param {Array or NodeList or HTMLElement} elems
	 * @returns {Array} items - collection of new Outlayer Items
	 */
	Outlayer.prototype._itemize = function( elems ) {

	  var itemElems = this._filterFindItemElements( elems );
	  var Item = this.constructor.Item;

	  // create new Outlayer Items for collection
	  var items = [];
	  for ( var i=0, len = itemElems.length; i < len; i++ ) {
	    var elem = itemElems[i];
	    var item = new Item( elem, this );
	    items.push( item );
	  }

	  return items;
	};

	/**
	 * get item elements to be used in layout
	 * @param {Array or NodeList or HTMLElement} elems
	 * @returns {Array} items - item elements
	 */
	Outlayer.prototype._filterFindItemElements = function( elems ) {
	  return utils.filterFindElements( elems, this.options.itemSelector );
	};

	/**
	 * getter method for getting item elements
	 * @returns {Array} elems - collection of item elements
	 */
	Outlayer.prototype.getItemElements = function() {
	  var elems = [];
	  for ( var i=0, len = this.items.length; i < len; i++ ) {
	    elems.push( this.items[i].element );
	  }
	  return elems;
	};

	// ----- init & layout ----- //

	/**
	 * lays out all items
	 */
	Outlayer.prototype.layout = function() {
	  this._resetLayout();
	  this._manageStamps();

	  // don't animate first layout
	  var isInstant = this.options.isLayoutInstant !== undefined ?
	    this.options.isLayoutInstant : !this._isLayoutInited;
	  this.layoutItems( this.items, isInstant );

	  // flag for initalized
	  this._isLayoutInited = true;
	};

	// _init is alias for layout
	Outlayer.prototype._init = Outlayer.prototype.layout;

	/**
	 * logic before any new layout
	 */
	Outlayer.prototype._resetLayout = function() {
	  this.getSize();
	};


	Outlayer.prototype.getSize = function() {
	  this.size = getSize( this.element );
	};

	/**
	 * get measurement from option, for columnWidth, rowHeight, gutter
	 * if option is String -> get element from selector string, & get size of element
	 * if option is Element -> get size of element
	 * else use option as a number
	 *
	 * @param {String} measurement
	 * @param {String} size - width or height
	 * @private
	 */
	Outlayer.prototype._getMeasurement = function( measurement, size ) {
	  var option = this.options[ measurement ];
	  var elem;
	  if ( !option ) {
	    // default to 0
	    this[ measurement ] = 0;
	  } else {
	    // use option as an element
	    if ( typeof option === 'string' ) {
	      elem = this.element.querySelector( option );
	    } else if ( utils.isElement( option ) ) {
	      elem = option;
	    }
	    // use size of element, if element
	    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
	  }
	};

	/**
	 * layout a collection of item elements
	 * @api public
	 */
	Outlayer.prototype.layoutItems = function( items, isInstant ) {
	  items = this._getItemsForLayout( items );

	  this._layoutItems( items, isInstant );

	  this._postLayout();
	};

	/**
	 * get the items to be laid out
	 * you may want to skip over some items
	 * @param {Array} items
	 * @returns {Array} items
	 */
	Outlayer.prototype._getItemsForLayout = function( items ) {
	  var layoutItems = [];
	  for ( var i=0, len = items.length; i < len; i++ ) {
	    var item = items[i];
	    if ( !item.isIgnored ) {
	      layoutItems.push( item );
	    }
	  }
	  return layoutItems;
	};

	/**
	 * layout items
	 * @param {Array} items
	 * @param {Boolean} isInstant
	 */
	Outlayer.prototype._layoutItems = function( items, isInstant ) {
	  this._emitCompleteOnItems( 'layout', items );

	  if ( !items || !items.length ) {
	    // no items, emit event with empty array
	    return;
	  }

	  var queue = [];

	  for ( var i=0, len = items.length; i < len; i++ ) {
	    var item = items[i];
	    // get x/y object from method
	    var position = this._getItemLayoutPosition( item );
	    // enqueue
	    position.item = item;
	    position.isInstant = isInstant || item.isLayoutInstant;
	    queue.push( position );
	  }

	  this._processLayoutQueue( queue );
	};

	/**
	 * get item layout position
	 * @param {Outlayer.Item} item
	 * @returns {Object} x and y position
	 */
	Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
	  return {
	    x: 0,
	    y: 0
	  };
	};

	/**
	 * iterate over array and position each item
	 * Reason being - separating this logic prevents 'layout invalidation'
	 * thx @paul_irish
	 * @param {Array} queue
	 */
	Outlayer.prototype._processLayoutQueue = function( queue ) {
	  for ( var i=0, len = queue.length; i < len; i++ ) {
	    var obj = queue[i];
	    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
	  }
	};

	/**
	 * Sets position of item in DOM
	 * @param {Outlayer.Item} item
	 * @param {Number} x - horizontal position
	 * @param {Number} y - vertical position
	 * @param {Boolean} isInstant - disables transitions
	 */
	Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
	  if ( isInstant ) {
	    // if not transition, just set CSS
	    item.goTo( x, y );
	  } else {
	    item.moveTo( x, y );
	  }
	};

	/**
	 * Any logic you want to do after each layout,
	 * i.e. size the container
	 */
	Outlayer.prototype._postLayout = function() {
	  this.resizeContainer();
	};

	Outlayer.prototype.resizeContainer = function() {
	  if ( !this.options.isResizingContainer ) {
	    return;
	  }
	  var size = this._getContainerSize();
	  if ( size ) {
	    this._setContainerMeasure( size.width, true );
	    this._setContainerMeasure( size.height, false );
	  }
	};

	/**
	 * Sets width or height of container if returned
	 * @returns {Object} size
	 *   @param {Number} width
	 *   @param {Number} height
	 */
	Outlayer.prototype._getContainerSize = noop;

	/**
	 * @param {Number} measure - size of width or height
	 * @param {Boolean} isWidth
	 */
	Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
	  if ( measure === undefined ) {
	    return;
	  }

	  var elemSize = this.size;
	  // add padding and border width if border box
	  if ( elemSize.isBorderBox ) {
	    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
	      elemSize.borderLeftWidth + elemSize.borderRightWidth :
	      elemSize.paddingBottom + elemSize.paddingTop +
	      elemSize.borderTopWidth + elemSize.borderBottomWidth;
	  }

	  measure = Math.max( measure, 0 );
	  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
	};

	/**
	 * emit eventComplete on a collection of items events
	 * @param {String} eventName
	 * @param {Array} items - Outlayer.Items
	 */
	Outlayer.prototype._emitCompleteOnItems = function( eventName, items ) {
	  var _this = this;
	  function onComplete() {
	    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
	  }

	  var count = items.length;
	  if ( !items || !count ) {
	    onComplete();
	    return;
	  }

	  var doneCount = 0;
	  function tick() {
	    doneCount++;
	    if ( doneCount === count ) {
	      onComplete();
	    }
	  }

	  // bind callback
	  for ( var i=0, len = items.length; i < len; i++ ) {
	    var item = items[i];
	    item.once( eventName, tick );
	  }
	};

	/**
	 * emits events via eventEmitter and jQuery events
	 * @param {String} type - name of event
	 * @param {Event} event - original event
	 * @param {Array} args - extra arguments
	 */
	Outlayer.prototype.dispatchEvent = function( type, event, args ) {
	  // add original event to arguments
	  var emitArgs = event ? [ event ].concat( args ) : args;
	  this.emitEvent( type, emitArgs );

	  if ( jQuery ) {
	    // set this.$element
	    this.$element = this.$element || jQuery( this.element );
	    if ( event ) {
	      // create jQuery event
	      var $event = jQuery.Event( event );
	      $event.type = type;
	      this.$element.trigger( $event, args );
	    } else {
	      // just trigger with type if no event available
	      this.$element.trigger( type, args );
	    }
	  }
	};

	// -------------------------- ignore & stamps -------------------------- //


	/**
	 * keep item in collection, but do not lay it out
	 * ignored items do not get skipped in layout
	 * @param {Element} elem
	 */
	Outlayer.prototype.ignore = function( elem ) {
	  var item = this.getItem( elem );
	  if ( item ) {
	    item.isIgnored = true;
	  }
	};

	/**
	 * return item to layout collection
	 * @param {Element} elem
	 */
	Outlayer.prototype.unignore = function( elem ) {
	  var item = this.getItem( elem );
	  if ( item ) {
	    delete item.isIgnored;
	  }
	};

	/**
	 * adds elements to stamps
	 * @param {NodeList, Array, Element, or String} elems
	 */
	Outlayer.prototype.stamp = function( elems ) {
	  elems = this._find( elems );
	  if ( !elems ) {
	    return;
	  }

	  this.stamps = this.stamps.concat( elems );
	  // ignore
	  for ( var i=0, len = elems.length; i < len; i++ ) {
	    var elem = elems[i];
	    this.ignore( elem );
	  }
	};

	/**
	 * removes elements to stamps
	 * @param {NodeList, Array, or Element} elems
	 */
	Outlayer.prototype.unstamp = function( elems ) {
	  elems = this._find( elems );
	  if ( !elems ){
	    return;
	  }

	  for ( var i=0, len = elems.length; i < len; i++ ) {
	    var elem = elems[i];
	    // filter out removed stamp elements
	    utils.removeFrom( this.stamps, elem );
	    this.unignore( elem );
	  }

	};

	/**
	 * finds child elements
	 * @param {NodeList, Array, Element, or String} elems
	 * @returns {Array} elems
	 */
	Outlayer.prototype._find = function( elems ) {
	  if ( !elems ) {
	    return;
	  }
	  // if string, use argument as selector string
	  if ( typeof elems === 'string' ) {
	    elems = this.element.querySelectorAll( elems );
	  }
	  elems = utils.makeArray( elems );
	  return elems;
	};

	Outlayer.prototype._manageStamps = function() {
	  if ( !this.stamps || !this.stamps.length ) {
	    return;
	  }

	  this._getBoundingRect();

	  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
	    var stamp = this.stamps[i];
	    this._manageStamp( stamp );
	  }
	};

	// update boundingLeft / Top
	Outlayer.prototype._getBoundingRect = function() {
	  // get bounding rect for container element
	  var boundingRect = this.element.getBoundingClientRect();
	  var size = this.size;
	  this._boundingRect = {
	    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
	    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
	    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
	    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
	  };
	};

	/**
	 * @param {Element} stamp
	**/
	Outlayer.prototype._manageStamp = noop;

	/**
	 * get x/y position of element relative to container element
	 * @param {Element} elem
	 * @returns {Object} offset - has left, top, right, bottom
	 */
	Outlayer.prototype._getElementOffset = function( elem ) {
	  var boundingRect = elem.getBoundingClientRect();
	  var thisRect = this._boundingRect;
	  var size = getSize( elem );
	  var offset = {
	    left: boundingRect.left - thisRect.left - size.marginLeft,
	    top: boundingRect.top - thisRect.top - size.marginTop,
	    right: thisRect.right - boundingRect.right - size.marginRight,
	    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
	  };
	  return offset;
	};

	// -------------------------- resize -------------------------- //

	// enable event handlers for listeners
	// i.e. resize -> onresize
	Outlayer.prototype.handleEvent = function( event ) {
	  var method = 'on' + event.type;
	  if ( this[ method ] ) {
	    this[ method ]( event );
	  }
	};

	/**
	 * Bind layout to window resizing
	 */
	Outlayer.prototype.bindResize = function() {
	  // bind just one listener
	  if ( this.isResizeBound ) {
	    return;
	  }
	  eventie.bind( window, 'resize', this );
	  this.isResizeBound = true;
	};

	/**
	 * Unbind layout to window resizing
	 */
	Outlayer.prototype.unbindResize = function() {
	  if ( this.isResizeBound ) {
	    eventie.unbind( window, 'resize', this );
	  }
	  this.isResizeBound = false;
	};

	// original debounce by John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

	// this fires every resize
	Outlayer.prototype.onresize = function() {
	  if ( this.resizeTimeout ) {
	    clearTimeout( this.resizeTimeout );
	  }

	  var _this = this;
	  function delayed() {
	    _this.resize();
	    delete _this.resizeTimeout;
	  }

	  this.resizeTimeout = setTimeout( delayed, 100 );
	};

	// debounced, layout on resize
	Outlayer.prototype.resize = function() {
	  // don't trigger if size did not change
	  // or if resize was unbound. See #9
	  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
	    return;
	  }

	  this.layout();
	};

	/**
	 * check if layout is needed post layout
	 * @returns Boolean
	 */
	Outlayer.prototype.needsResizeLayout = function() {
	  var size = getSize( this.element );
	  // check that this.size and size are there
	  // IE8 triggers resize on body size change, so they might not be
	  var hasSizes = this.size && size;
	  return hasSizes && size.innerWidth !== this.size.innerWidth;
	};

	// -------------------------- methods -------------------------- //

	/**
	 * add items to Outlayer instance
	 * @param {Array or NodeList or Element} elems
	 * @returns {Array} items - Outlayer.Items
	**/
	Outlayer.prototype.addItems = function( elems ) {
	  var items = this._itemize( elems );
	  // add items to collection
	  if ( items.length ) {
	    this.items = this.items.concat( items );
	  }
	  return items;
	};

	/**
	 * Layout newly-appended item elements
	 * @param {Array or NodeList or Element} elems
	 */
	Outlayer.prototype.appended = function( elems ) {
	  var items = this.addItems( elems );
	  if ( !items.length ) {
	    return;
	  }
	  // layout and reveal just the new items
	  this.layoutItems( items, true );
	  this.reveal( items );
	};

	/**
	 * Layout prepended elements
	 * @param {Array or NodeList or Element} elems
	 */
	Outlayer.prototype.prepended = function( elems ) {
	  var items = this._itemize( elems );
	  if ( !items.length ) {
	    return;
	  }
	  // add items to beginning of collection
	  var previousItems = this.items.slice(0);
	  this.items = items.concat( previousItems );
	  // start new layout
	  this._resetLayout();
	  this._manageStamps();
	  // layout new stuff without transition
	  this.layoutItems( items, true );
	  this.reveal( items );
	  // layout previous items
	  this.layoutItems( previousItems );
	};

	/**
	 * reveal a collection of items
	 * @param {Array of Outlayer.Items} items
	 */
	Outlayer.prototype.reveal = function( items ) {
	  this._emitCompleteOnItems( 'reveal', items );

	  var len = items && items.length;
	  for ( var i=0; len && i < len; i++ ) {
	    var item = items[i];
	    item.reveal();
	  }
	};

	/**
	 * hide a collection of items
	 * @param {Array of Outlayer.Items} items
	 */
	Outlayer.prototype.hide = function( items ) {
	  this._emitCompleteOnItems( 'hide', items );

	  var len = items && items.length;
	  for ( var i=0; len && i < len; i++ ) {
	    var item = items[i];
	    item.hide();
	  }
	};

	/**
	 * reveal item elements
	 * @param {Array}, {Element}, {NodeList} items
	 */
	Outlayer.prototype.revealItemElements = function( elems ) {
	  var items = this.getItems( elems );
	  this.reveal( items );
	};

	/**
	 * hide item elements
	 * @param {Array}, {Element}, {NodeList} items
	 */
	Outlayer.prototype.hideItemElements = function( elems ) {
	  var items = this.getItems( elems );
	  this.hide( items );
	};

	/**
	 * get Outlayer.Item, given an Element
	 * @param {Element} elem
	 * @param {Function} callback
	 * @returns {Outlayer.Item} item
	 */
	Outlayer.prototype.getItem = function( elem ) {
	  // loop through items to get the one that matches
	  for ( var i=0, len = this.items.length; i < len; i++ ) {
	    var item = this.items[i];
	    if ( item.element === elem ) {
	      // return item
	      return item;
	    }
	  }
	};

	/**
	 * get collection of Outlayer.Items, given Elements
	 * @param {Array} elems
	 * @returns {Array} items - Outlayer.Items
	 */
	Outlayer.prototype.getItems = function( elems ) {
	  elems = utils.makeArray( elems );
	  var items = [];
	  for ( var i=0, len = elems.length; i < len; i++ ) {
	    var elem = elems[i];
	    var item = this.getItem( elem );
	    if ( item ) {
	      items.push( item );
	    }
	  }

	  return items;
	};

	/**
	 * remove element(s) from instance and DOM
	 * @param {Array or NodeList or Element} elems
	 */
	Outlayer.prototype.remove = function( elems ) {
	  var removeItems = this.getItems( elems );

	  this._emitCompleteOnItems( 'remove', removeItems );

	  // bail if no items to remove
	  if ( !removeItems || !removeItems.length ) {
	    return;
	  }

	  for ( var i=0, len = removeItems.length; i < len; i++ ) {
	    var item = removeItems[i];
	    item.remove();
	    // remove item from collection
	    utils.removeFrom( this.items, item );
	  }
	};

	// ----- destroy ----- //

	// remove and disable Outlayer instance
	Outlayer.prototype.destroy = function() {
	  // clean up dynamic styles
	  var style = this.element.style;
	  style.height = '';
	  style.position = '';
	  style.width = '';
	  // destroy items
	  for ( var i=0, len = this.items.length; i < len; i++ ) {
	    var item = this.items[i];
	    item.destroy();
	  }

	  this.unbindResize();

	  var id = this.element.outlayerGUID;
	  delete instances[ id ]; // remove reference to instance by id
	  delete this.element.outlayerGUID;
	  // remove data for jQuery
	  if ( jQuery ) {
	    jQuery.removeData( this.element, this.constructor.namespace );
	  }

	};

	// -------------------------- data -------------------------- //

	/**
	 * get Outlayer instance from element
	 * @param {Element} elem
	 * @returns {Outlayer}
	 */
	Outlayer.data = function( elem ) {
	  elem = utils.getQueryElement( elem );
	  var id = elem && elem.outlayerGUID;
	  return id && instances[ id ];
	};


	// -------------------------- create Outlayer class -------------------------- //

	/**
	 * create a layout class
	 * @param {String} namespace
	 */
	Outlayer.create = function( namespace, options ) {
	  // sub-class Outlayer
	  function Layout() {
	    Outlayer.apply( this, arguments );
	  }
	  // inherit Outlayer prototype, use Object.create if there
	  if ( Object.create ) {
	    Layout.prototype = Object.create( Outlayer.prototype );
	  } else {
	    utils.extend( Layout.prototype, Outlayer.prototype );
	  }
	  // set contructor, used for namespace and Item
	  Layout.prototype.constructor = Layout;

	  Layout.defaults = utils.extend( {}, Outlayer.defaults );
	  // apply new options
	  utils.extend( Layout.defaults, options );
	  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
	  Layout.prototype.settings = {};

	  Layout.namespace = namespace;

	  Layout.data = Outlayer.data;

	  // sub-class Item
	  Layout.Item = function LayoutItem() {
	    Item.apply( this, arguments );
	  };

	  Layout.Item.prototype = new Item();

	  // -------------------------- declarative -------------------------- //

	  utils.htmlInit( Layout, namespace );

	  // -------------------------- jQuery bridge -------------------------- //

	  // make into jQuery plugin
	  if ( jQuery && jQuery.bridget ) {
	    jQuery.bridget( namespace, Layout );
	  }

	  return Layout;
	};

	// ----- fin ----- //

	// back in global
	Outlayer.Item = Item;

	return Outlayer;

	}));


	}.call(window));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * eventie v1.0.6
	 * event binding helper
	 *   eventie.bind( elem, 'click', myFn )
	 *   eventie.unbind( elem, 'click', myFn )
	 * MIT license
	 */

	/*jshint browser: true, undef: true, unused: true */
	/*global define: false, module: false */

	( function( window ) {

	'use strict';

	var docElem = document.documentElement;

	var bind = function() {};

	function getIEEvent( obj ) {
	  var event = window.event;
	  // add event.target
	  event.target = event.target || event.srcElement || obj;
	  return event;
	}

	if ( docElem.addEventListener ) {
	  bind = function( obj, type, fn ) {
	    obj.addEventListener( type, fn, false );
	  };
	} else if ( docElem.attachEvent ) {
	  bind = function( obj, type, fn ) {
	    obj[ type + fn ] = fn.handleEvent ?
	      function() {
	        var event = getIEEvent( obj );
	        fn.handleEvent.call( fn, event );
	      } :
	      function() {
	        var event = getIEEvent( obj );
	        fn.call( obj, event );
	      };
	    obj.attachEvent( "on" + type, obj[ type + fn ] );
	  };
	}

	var unbind = function() {};

	if ( docElem.removeEventListener ) {
	  unbind = function( obj, type, fn ) {
	    obj.removeEventListener( type, fn, false );
	  };
	} else if ( docElem.detachEvent ) {
	  unbind = function( obj, type, fn ) {
	    obj.detachEvent( "on" + type, obj[ type + fn ] );
	    try {
	      delete obj[ type + fn ];
	    } catch ( err ) {
	      // can't delete window object properties
	      obj[ type + fn ] = undefined;
	    }
	  };
	}

	var eventie = {
	  bind: bind,
	  unbind: unbind
	};

	// ----- module definition ----- //

	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( eventie );
	} else if ( true ) {
	  // CommonJS
	  module.exports = eventie;
	} else {
	  // browser global
	  window.eventie = eventie;
	}

	})( window );

	}.call(window));

/***/ },
/* 17 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * EventEmitter v4.2.11 - git.io/ee
	 * Unlicense - http://unlicense.org/
	 * Oliver Caldwell - http://oli.me.uk/
	 * @preserve
	 */

	;(function () {
	    'use strict';

	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class EventEmitter Manages event registering and emitting.
	     */
	    function EventEmitter() {}

	    // Shortcuts to improve speed and size
	    var proto = EventEmitter.prototype;
	    var exports = this;
	    var originalGlobalValue = exports.EventEmitter;

	    /**
	     * Finds the index of the listener for the event in its storage array.
	     *
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @param {Function} listener Method to look for.
	     * @return {Number} Index of the specified listener, -1 if not found
	     * @api private
	     */
	    function indexOfListener(listeners, listener) {
	        var i = listeners.length;
	        while (i--) {
	            if (listeners[i].listener === listener) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    /**
	     * Alias a method while keeping the context correct, to allow for overwriting of target method.
	     *
	     * @param {String} name The name of the target method.
	     * @return {Function} The aliased method
	     * @api private
	     */
	    function alias(name) {
	        return function aliasClosure() {
	            return this[name].apply(this, arguments);
	        };
	    }

	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	     * Each property in the object response is an array of listener functions.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Function[]|Object} All listener functions for the event.
	     */
	    proto.getListeners = function getListeners(evt) {
	        var events = this._getEvents();
	        var response;
	        var key;

	        // Return a concatenated array of all matching events if
	        // the selector is a regular expression.
	        if (evt instanceof RegExp) {
	            response = {};
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    response[key] = events[key];
	                }
	            }
	        }
	        else {
	            response = events[evt] || (events[evt] = []);
	        }

	        return response;
	    };

	    /**
	     * Takes a list of listener objects and flattens it into a list of listener functions.
	     *
	     * @param {Object[]} listeners Raw listener objects.
	     * @return {Function[]} Just the listener functions.
	     */
	    proto.flattenListeners = function flattenListeners(listeners) {
	        var flatListeners = [];
	        var i;

	        for (i = 0; i < listeners.length; i += 1) {
	            flatListeners.push(listeners[i].listener);
	        }

	        return flatListeners;
	    };

	    /**
	     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Object} All listener functions for an event in an object.
	     */
	    proto.getListenersAsObject = function getListenersAsObject(evt) {
	        var listeners = this.getListeners(evt);
	        var response;

	        if (listeners instanceof Array) {
	            response = {};
	            response[evt] = listeners;
	        }

	        return response || listeners;
	    };

	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListener = function addListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = typeof listener === 'object';
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
	                listeners[key].push(listenerIsWrapped ? listener : {
	                    listener: listener,
	                    once: false
	                });
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of addListener
	     */
	    proto.on = alias('addListener');

	    /**
	     * Semi-alias of addListener. It will add a listener that will be
	     * automatically removed after its first execution.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addOnceListener = function addOnceListener(evt, listener) {
	        return this.addListener(evt, {
	            listener: listener,
	            once: true
	        });
	    };

	    /**
	     * Alias of addOnceListener.
	     */
	    proto.once = alias('addOnceListener');

	    /**
	     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	     * You need to tell it what event names should be matched by a regex.
	     *
	     * @param {String} evt Name of the event to create.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvent = function defineEvent(evt) {
	        this.getListeners(evt);
	        return this;
	    };

	    /**
	     * Uses defineEvent to define multiple events.
	     *
	     * @param {String[]} evts An array of event names to define.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvents = function defineEvents(evts) {
	        for (var i = 0; i < evts.length; i += 1) {
	            this.defineEvent(evts[i]);
	        }
	        return this;
	    };

	    /**
	     * Removes a listener function from the specified event.
	     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListener = function removeListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var index;
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key)) {
	                index = indexOfListener(listeners[key], listener);

	                if (index !== -1) {
	                    listeners[key].splice(index, 1);
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of removeListener
	     */
	    proto.off = alias('removeListener');

	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	     * You can also pass it a regular expression to add the array of listeners to all events that match it.
	     * Yeah, this function does quite a bit. That's probably a bad thing.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListeners = function addListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };

	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     * You can also pass it a regular expression to remove the listeners from all events that match it.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListeners = function removeListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };

	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
	        var i;
	        var value;
	        var single = remove ? this.removeListener : this.addListener;
	        var multiple = remove ? this.removeListeners : this.addListeners;

	        // If evt is an object then pass each of its properties to this method
	        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    }
	                    else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        }
	        else {
	            // So evt must be a string
	            // And listeners must be an array of listeners
	            // Loop over it and pass each one to the multiple method
	            i = listeners.length;
	            while (i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }

	        return this;
	    };

	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     * You can also pass a regex to remove all events that match it.
	     *
	     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeEvent = function removeEvent(evt) {
	        var type = typeof evt;
	        var events = this._getEvents();
	        var key;

	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        }
	        else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        }
	        else {
	            // Remove all listeners in all events
	            delete this._events;
	        }

	        return this;
	    };

	    /**
	     * Alias of removeEvent.
	     *
	     * Added to mirror the node API.
	     */
	    proto.removeAllListeners = alias('removeEvent');

	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     * You can also pass a regular expression to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emitEvent = function emitEvent(evt, args) {
	        var listenersMap = this.getListenersAsObject(evt);
	        var listeners;
	        var listener;
	        var i;
	        var key;
	        var response;

	        for (key in listenersMap) {
	            if (listenersMap.hasOwnProperty(key)) {
	                listeners = listenersMap[key].slice(0);
	                i = listeners.length;

	                while (i--) {
	                    // If the listener returns true then it shall be removed from the event
	                    // The function is executed either with a basic call or an apply if there is an args array
	                    listener = listeners[i];

	                    if (listener.once === true) {
	                        this.removeListener(evt, listener.listener);
	                    }

	                    response = listener.listener.apply(this, args || []);

	                    if (response === this._getOnceReturnValue()) {
	                        this.removeListener(evt, listener.listener);
	                    }
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of emitEvent
	     */
	    proto.trigger = alias('emitEvent');

	    /**
	     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {...*} Optional additional arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emit = function emit(evt) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return this.emitEvent(evt, args);
	    };

	    /**
	     * Sets the current value to check against when executing listeners. If a
	     * listeners return value matches the one set here then it will be removed
	     * after execution. This value defaults to true.
	     *
	     * @param {*} value The new value to check for when executing listeners.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.setOnceReturnValue = function setOnceReturnValue(value) {
	        this._onceReturnValue = value;
	        return this;
	    };

	    /**
	     * Fetches the current value to check against when executing listeners. If
	     * the listeners return value matches this one then it should be removed
	     * automatically. It will return true by default.
	     *
	     * @return {*|Boolean} The current value to check for or the default, true.
	     * @api private
	     */
	    proto._getOnceReturnValue = function _getOnceReturnValue() {
	        if (this.hasOwnProperty('_onceReturnValue')) {
	            return this._onceReturnValue;
	        }
	        else {
	            return true;
	        }
	    };

	    /**
	     * Fetches the events object and creates one if required.
	     *
	     * @return {Object} The events storage object.
	     * @api private
	     */
	    proto._getEvents = function _getEvents() {
	        return this._events || (this._events = {});
	    };

	    /**
	     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	     *
	     * @return {Function} Non conflicting EventEmitter class.
	     */
	    EventEmitter.noConflict = function noConflict() {
	        exports.EventEmitter = originalGlobalValue;
	        return EventEmitter;
	    };

	    // Expose the class either via AMD, CommonJS or the global object
	    if (typeof define === 'function' && define.amd) {
	        define(function () {
	            return EventEmitter;
	        });
	    }
	    else if (typeof module === 'object' && module.exports){
	        module.exports = EventEmitter;
	    }
	    else {
	        exports.EventEmitter = EventEmitter;
	    }
	}.call(this));

	}.call(window));

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * getSize v1.2.2
	 * measure size of elements
	 * MIT license
	 */

	/*jshint browser: true, strict: true, undef: true, unused: true */
	/*global define: false, exports: false, require: false, module: false, console: false */

	( function( window, undefined ) {

	'use strict';

	// -------------------------- helpers -------------------------- //

	// get a number from a string, not a percentage
	function getStyleSize( value ) {
	  var num = parseFloat( value );
	  // not a percent like '100%', and a number
	  var isValid = value.indexOf('%') === -1 && !isNaN( num );
	  return isValid && num;
	}

	function noop() {}

	var logError = typeof console === 'undefined' ? noop :
	  function( message ) {
	    console.error( message );
	  };

	// -------------------------- measurements -------------------------- //

	var measurements = [
	  'paddingLeft',
	  'paddingRight',
	  'paddingTop',
	  'paddingBottom',
	  'marginLeft',
	  'marginRight',
	  'marginTop',
	  'marginBottom',
	  'borderLeftWidth',
	  'borderRightWidth',
	  'borderTopWidth',
	  'borderBottomWidth'
	];

	function getZeroSize() {
	  var size = {
	    width: 0,
	    height: 0,
	    innerWidth: 0,
	    innerHeight: 0,
	    outerWidth: 0,
	    outerHeight: 0
	  };
	  for ( var i=0, len = measurements.length; i < len; i++ ) {
	    var measurement = measurements[i];
	    size[ measurement ] = 0;
	  }
	  return size;
	}



	function defineGetSize( getStyleProperty ) {

	// -------------------------- setup -------------------------- //

	var isSetup = false;

	var getStyle, boxSizingProp, isBoxSizeOuter;

	/**
	 * setup vars and functions
	 * do it on initial getSize(), rather than on script load
	 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
	 */
	function setup() {
	  // setup once
	  if ( isSetup ) {
	    return;
	  }
	  isSetup = true;

	  var getComputedStyle = window.getComputedStyle;
	  getStyle = ( function() {
	    var getStyleFn = getComputedStyle ?
	      function( elem ) {
	        return getComputedStyle( elem, null );
	      } :
	      function( elem ) {
	        return elem.currentStyle;
	      };

	      return function getStyle( elem ) {
	        var style = getStyleFn( elem );
	        if ( !style ) {
	          logError( 'Style returned ' + style +
	            '. Are you running this code in a hidden iframe on Firefox? ' +
	            'See http://bit.ly/getsizebug1' );
	        }
	        return style;
	      };
	  })();

	  // -------------------------- box sizing -------------------------- //

	  boxSizingProp = getStyleProperty('boxSizing');

	  /**
	   * WebKit measures the outer-width on style.width on border-box elems
	   * IE & Firefox measures the inner-width
	   */
	  if ( boxSizingProp ) {
	    var div = document.createElement('div');
	    div.style.width = '200px';
	    div.style.padding = '1px 2px 3px 4px';
	    div.style.borderStyle = 'solid';
	    div.style.borderWidth = '1px 2px 3px 4px';
	    div.style[ boxSizingProp ] = 'border-box';

	    var body = document.body || document.documentElement;
	    body.appendChild( div );
	    var style = getStyle( div );

	    isBoxSizeOuter = getStyleSize( style.width ) === 200;
	    body.removeChild( div );
	  }

	}

	// -------------------------- getSize -------------------------- //

	function getSize( elem ) {
	  setup();

	  // use querySeletor if elem is string
	  if ( typeof elem === 'string' ) {
	    elem = document.querySelector( elem );
	  }

	  // do not proceed on non-objects
	  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
	    return;
	  }

	  var style = getStyle( elem );

	  // if hidden, everything is 0
	  if ( style.display === 'none' ) {
	    return getZeroSize();
	  }

	  var size = {};
	  size.width = elem.offsetWidth;
	  size.height = elem.offsetHeight;

	  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
	    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

	  // get all measurements
	  for ( var i=0, len = measurements.length; i < len; i++ ) {
	    var measurement = measurements[i];
	    var value = style[ measurement ];
	    value = mungeNonPixel( elem, value );
	    var num = parseFloat( value );
	    // any 'auto', 'medium' value will be 0
	    size[ measurement ] = !isNaN( num ) ? num : 0;
	  }

	  var paddingWidth = size.paddingLeft + size.paddingRight;
	  var paddingHeight = size.paddingTop + size.paddingBottom;
	  var marginWidth = size.marginLeft + size.marginRight;
	  var marginHeight = size.marginTop + size.marginBottom;
	  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
	  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

	  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

	  // overwrite width and height if we can get it from style
	  var styleWidth = getStyleSize( style.width );
	  if ( styleWidth !== false ) {
	    size.width = styleWidth +
	      // add padding and border unless it's already including it
	      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
	  }

	  var styleHeight = getStyleSize( style.height );
	  if ( styleHeight !== false ) {
	    size.height = styleHeight +
	      // add padding and border unless it's already including it
	      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
	  }

	  size.innerWidth = size.width - ( paddingWidth + borderWidth );
	  size.innerHeight = size.height - ( paddingHeight + borderHeight );

	  size.outerWidth = size.width + marginWidth;
	  size.outerHeight = size.height + marginHeight;

	  return size;
	}

	// IE8 returns percent values, not pixels
	// taken from jQuery's curCSS
	function mungeNonPixel( elem, value ) {
	  // IE8 and has percent value
	  if ( window.getComputedStyle || value.indexOf('%') === -1 ) {
	    return value;
	  }
	  var style = elem.style;
	  // Remember the original values
	  var left = style.left;
	  var rs = elem.runtimeStyle;
	  var rsLeft = rs && rs.left;

	  // Put in the new values to get a computed value out
	  if ( rsLeft ) {
	    rs.left = elem.currentStyle.left;
	  }
	  style.left = value;
	  value = style.pixelLeft;

	  // Revert the changed values
	  style.left = left;
	  if ( rsLeft ) {
	    rs.left = rsLeft;
	  }

	  return value;
	}

	return getSize;

	}

	// transport
	if ( typeof define === 'function' && define.amd ) {
	  // AMD for RequireJS
	  define( [ 'get-style-property/get-style-property' ], defineGetSize );
	} else if ( true ) {
	  // CommonJS for Component
	  module.exports = defineGetSize( __webpack_require__(19) );
	} else {
	  // browser global
	  window.getSize = defineGetSize( window.getStyleProperty );
	}

	})( window );

	}.call(window));

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * getStyleProperty v1.0.4
	 * original by kangax
	 * http://perfectionkills.com/feature-testing-css-properties/
	 * MIT license
	 */

	/*jshint browser: true, strict: true, undef: true */
	/*global define: false, exports: false, module: false */

	( function( window ) {

	'use strict';

	var prefixes = 'Webkit Moz ms Ms O'.split(' ');
	var docElemStyle = document.documentElement.style;

	function getStyleProperty( propName ) {
	  if ( !propName ) {
	    return;
	  }

	  // test standard property first
	  if ( typeof docElemStyle[ propName ] === 'string' ) {
	    return propName;
	  }

	  // capitalize
	  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

	  // test vendor specific properties
	  var prefixed;
	  for ( var i=0, len = prefixes.length; i < len; i++ ) {
	    prefixed = prefixes[i] + propName;
	    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
	      return prefixed;
	    }
	  }
	}

	// transport
	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( function() {
	    return getStyleProperty;
	  });
	} else if ( true ) {
	  // CommonJS for Component
	  module.exports = getStyleProperty;
	} else {
	  // browser global
	  window.getStyleProperty = getStyleProperty;
	}

	})( window );

	}.call(window));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/**
	 * Fizzy UI utils v1.0.1
	 * MIT license
	 */

	/*jshint browser: true, undef: true, unused: true, strict: true */

	( function( window, factory ) {
	  /*global define: false, module: false, require: false */
	  'use strict';
	  // universal module definition

	  if ( typeof define == 'function' && define.amd ) {
	    // AMD
	    define( [
	      'doc-ready/doc-ready',
	      'matches-selector/matches-selector'
	    ], function( docReady, matchesSelector ) {
	      return factory( window, docReady, matchesSelector );
	    });
	  } else if ( true ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      __webpack_require__(21),
	      __webpack_require__(23)
	    );
	  } else {
	    // browser global
	    window.fizzyUIUtils = factory(
	      window,
	      window.docReady,
	      window.matchesSelector
	    );
	  }

	}( window, function factory( window, docReady, matchesSelector ) {

	'use strict';

	var utils = {};

	// ----- extend ----- //

	// extends objects
	utils.extend = function( a, b ) {
	  for ( var prop in b ) {
	    a[ prop ] = b[ prop ];
	  }
	  return a;
	};

	// ----- modulo ----- //

	utils.modulo = function( num, div ) {
	  return ( ( num % div ) + div ) % div;
	};

	// ----- isArray ----- //
	  
	var objToString = Object.prototype.toString;
	utils.isArray = function( obj ) {
	  return objToString.call( obj ) == '[object Array]';
	};

	// ----- makeArray ----- //

	// turn element or nodeList into an array
	utils.makeArray = function( obj ) {
	  var ary = [];
	  if ( utils.isArray( obj ) ) {
	    // use object if already an array
	    ary = obj;
	  } else if ( obj && typeof obj.length == 'number' ) {
	    // convert nodeList to array
	    for ( var i=0, len = obj.length; i < len; i++ ) {
	      ary.push( obj[i] );
	    }
	  } else {
	    // array of single index
	    ary.push( obj );
	  }
	  return ary;
	};

	// ----- indexOf ----- //

	// index of helper cause IE8
	utils.indexOf = Array.prototype.indexOf ? function( ary, obj ) {
	    return ary.indexOf( obj );
	  } : function( ary, obj ) {
	    for ( var i=0, len = ary.length; i < len; i++ ) {
	      if ( ary[i] === obj ) {
	        return i;
	      }
	    }
	    return -1;
	  };

	// ----- removeFrom ----- //

	utils.removeFrom = function( ary, obj ) {
	  var index = utils.indexOf( ary, obj );
	  if ( index != -1 ) {
	    ary.splice( index, 1 );
	  }
	};

	// ----- isElement ----- //

	// http://stackoverflow.com/a/384380/182183
	utils.isElement = ( typeof HTMLElement == 'function' || typeof HTMLElement == 'object' ) ?
	  function isElementDOM2( obj ) {
	    return obj instanceof HTMLElement;
	  } :
	  function isElementQuirky( obj ) {
	    return obj && typeof obj == 'object' &&
	      obj.nodeType == 1 && typeof obj.nodeName == 'string';
	  };

	// ----- setText ----- //

	utils.setText = ( function() {
	  var setTextProperty;
	  function setText( elem, text ) {
	    // only check setTextProperty once
	    setTextProperty = setTextProperty || ( document.documentElement.textContent !== undefined ? 'textContent' : 'innerText' );
	    elem[ setTextProperty ] = text;
	  }
	  return setText;
	})();

	// ----- getParent ----- //

	utils.getParent = function( elem, selector ) {
	  while ( elem != document.body ) {
	    elem = elem.parentNode;
	    if ( matchesSelector( elem, selector ) ) {
	      return elem;
	    }
	  }
	};

	// ----- getQueryElement ----- //

	// use element as selector string
	utils.getQueryElement = function( elem ) {
	  if ( typeof elem == 'string' ) {
	    return document.querySelector( elem );
	  }
	  return elem;
	};

	// ----- handleEvent ----- //

	// enable .ontype to trigger from .addEventListener( elem, 'type' )
	utils.handleEvent = function( event ) {
	  var method = 'on' + event.type;
	  if ( this[ method ] ) {
	    this[ method ]( event );
	  }
	};

	// ----- filterFindElements ----- //

	utils.filterFindElements = function( elems, selector ) {
	  // make array of elems
	  elems = utils.makeArray( elems );
	  var ffElems = [];

	  for ( var i=0, len = elems.length; i < len; i++ ) {
	    var elem = elems[i];
	    // check that elem is an actual element
	    if ( !utils.isElement( elem ) ) {
	      continue;
	    }
	    // filter & find items if we have a selector
	    if ( selector ) {
	      // filter siblings
	      if ( matchesSelector( elem, selector ) ) {
	        ffElems.push( elem );
	      }
	      // find children
	      var childElems = elem.querySelectorAll( selector );
	      // concat childElems to filterFound array
	      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
	        ffElems.push( childElems[j] );
	      }
	    } else {
	      ffElems.push( elem );
	    }
	  }

	  return ffElems;
	};

	// ----- debounceMethod ----- //

	utils.debounceMethod = function( _class, methodName, threshold ) {
	  // original method
	  var method = _class.prototype[ methodName ];
	  var timeoutName = methodName + 'Timeout';

	  _class.prototype[ methodName ] = function() {
	    var timeout = this[ timeoutName ];
	    if ( timeout ) {
	      clearTimeout( timeout );
	    }
	    var args = arguments;

	    var _this = this;
	    this[ timeoutName ] = setTimeout( function() {
	      method.apply( _this, args );
	      delete _this[ timeoutName ];
	    }, threshold || 100 );
	  };
	};

	// ----- htmlInit ----- //

	// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
	utils.toDashed = function( str ) {
	  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
	    return $1 + '-' + $2;
	  }).toLowerCase();
	};

	var console = window.console;
	/**
	 * allow user to initialize classes via .js-namespace class
	 * htmlInit( Widget, 'widgetName' )
	 * options are parsed from data-namespace-option attribute
	 */
	utils.htmlInit = function( WidgetClass, namespace ) {
	  docReady( function() {
	    var dashedNamespace = utils.toDashed( namespace );
	    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
	    var dataAttr = 'data-' + dashedNamespace + '-options';

	    for ( var i=0, len = elems.length; i < len; i++ ) {
	      var elem = elems[i];
	      var attr = elem.getAttribute( dataAttr );
	      var options;
	      try {
	        options = attr && JSON.parse( attr );
	      } catch ( error ) {
	        // log error, do not initialize
	        if ( console ) {
	          console.error( 'Error parsing ' + dataAttr + ' on ' +
	            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
	            error );
	        }
	        continue;
	      }
	      // initialize
	      var instance = new WidgetClass( elem, options );
	      // make available via $().data('layoutname')
	      var jQuery = window.jQuery;
	      if ( jQuery ) {
	        jQuery.data( elem, namespace, instance );
	      }
	    }
	  });
	};

	// -----  ----- //

	return utils;

	}));

	}.call(window));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * docReady v1.0.3
	 * Cross browser DOMContentLoaded event emitter
	 * MIT license
	 */

	/*jshint browser: true, strict: true, undef: true, unused: true*/
	/*global define: false, require: false, module: false */

	( function( window ) {

	'use strict';

	var document = window.document;
	// collection of functions to be triggered on ready
	var queue = [];

	function docReady( fn ) {
	  // throw out non-functions
	  if ( typeof fn !== 'function' ) {
	    return;
	  }

	  if ( docReady.isReady ) {
	    // ready now, hit it
	    fn();
	  } else {
	    // queue function when ready
	    queue.push( fn );
	  }
	}

	docReady.isReady = false;

	// triggered on various doc ready events
	function init( event ) {
	  // bail if IE8 document is not ready just yet
	  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
	  if ( docReady.isReady || isIE8NotReady ) {
	    return;
	  }
	  docReady.isReady = true;

	  // process queue
	  for ( var i=0, len = queue.length; i < len; i++ ) {
	    var fn = queue[i];
	    fn();
	  }
	}

	function defineDocReady( eventie ) {
	  eventie.bind( document, 'DOMContentLoaded', init );
	  eventie.bind( document, 'readystatechange', init );
	  eventie.bind( window, 'load', init );

	  return docReady;
	}

	// transport
	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  // if RequireJS, then doc is already ready
	  docReady.isReady = typeof requirejs === 'function';
	  define( [ 'eventie/eventie' ], defineDocReady );
	} else if ( true ) {
	  module.exports = defineDocReady( __webpack_require__(22) );
	} else {
	  // browser global
	  window.docReady = defineDocReady( window.eventie );
	}

	})( window );

	}.call(window));

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * eventie v1.0.6
	 * event binding helper
	 *   eventie.bind( elem, 'click', myFn )
	 *   eventie.unbind( elem, 'click', myFn )
	 * MIT license
	 */

	/*jshint browser: true, undef: true, unused: true */
	/*global define: false, module: false */

	( function( window ) {

	'use strict';

	var docElem = document.documentElement;

	var bind = function() {};

	function getIEEvent( obj ) {
	  var event = window.event;
	  // add event.target
	  event.target = event.target || event.srcElement || obj;
	  return event;
	}

	if ( docElem.addEventListener ) {
	  bind = function( obj, type, fn ) {
	    obj.addEventListener( type, fn, false );
	  };
	} else if ( docElem.attachEvent ) {
	  bind = function( obj, type, fn ) {
	    obj[ type + fn ] = fn.handleEvent ?
	      function() {
	        var event = getIEEvent( obj );
	        fn.handleEvent.call( fn, event );
	      } :
	      function() {
	        var event = getIEEvent( obj );
	        fn.call( obj, event );
	      };
	    obj.attachEvent( "on" + type, obj[ type + fn ] );
	  };
	}

	var unbind = function() {};

	if ( docElem.removeEventListener ) {
	  unbind = function( obj, type, fn ) {
	    obj.removeEventListener( type, fn, false );
	  };
	} else if ( docElem.detachEvent ) {
	  unbind = function( obj, type, fn ) {
	    obj.detachEvent( "on" + type, obj[ type + fn ] );
	    try {
	      delete obj[ type + fn ];
	    } catch ( err ) {
	      // can't delete window object properties
	      obj[ type + fn ] = undefined;
	    }
	  };
	}

	var eventie = {
	  bind: bind,
	  unbind: unbind
	};

	// ----- module definition ----- //

	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( eventie );
	} else if ( true ) {
	  // CommonJS
	  module.exports = eventie;
	} else {
	  // browser global
	  window.eventie = eventie;
	}

	})( window );

	}.call(window));

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/**
	 * matchesSelector v1.0.3
	 * matchesSelector( element, '.selector' )
	 * MIT license
	 */

	/*jshint browser: true, strict: true, undef: true, unused: true */
	/*global define: false, module: false */

	( function( ElemProto ) {

	  'use strict';

	  var matchesMethod = ( function() {
	    // check for the standard method name first
	    if ( ElemProto.matches ) {
	      return 'matches';
	    }
	    // check un-prefixed
	    if ( ElemProto.matchesSelector ) {
	      return 'matchesSelector';
	    }
	    // check vendor prefixes
	    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

	    for ( var i=0, len = prefixes.length; i < len; i++ ) {
	      var prefix = prefixes[i];
	      var method = prefix + 'MatchesSelector';
	      if ( ElemProto[ method ] ) {
	        return method;
	      }
	    }
	  })();

	  // ----- match ----- //

	  function match( elem, selector ) {
	    return elem[ matchesMethod ]( selector );
	  }

	  // ----- appendToFragment ----- //

	  function checkParent( elem ) {
	    // not needed if already has parent
	    if ( elem.parentNode ) {
	      return;
	    }
	    var fragment = document.createDocumentFragment();
	    fragment.appendChild( elem );
	  }

	  // ----- query ----- //

	  // fall back to using QSA
	  // thx @jonathantneal https://gist.github.com/3062955
	  function query( elem, selector ) {
	    // append to fragment if no parent
	    checkParent( elem );

	    // match elem with all selected elems of parent
	    var elems = elem.parentNode.querySelectorAll( selector );
	    for ( var i=0, len = elems.length; i < len; i++ ) {
	      // return true if match
	      if ( elems[i] === elem ) {
	        return true;
	      }
	    }
	    // otherwise return false
	    return false;
	  }

	  // ----- matchChild ----- //

	  function matchChild( elem, selector ) {
	    checkParent( elem );
	    return match( elem, selector );
	  }

	  // ----- matchesSelector ----- //

	  var matchesSelector;

	  if ( matchesMethod ) {
	    // IE9 supports matchesSelector, but doesn't work on orphaned elems
	    // check for that
	    var div = document.createElement('div');
	    var supportsOrphans = match( div, 'div' );
	    matchesSelector = supportsOrphans ? match : matchChild;
	  } else {
	    matchesSelector = query;
	  }

	  // transport
	  if ( typeof define === 'function' && define.amd ) {
	    // AMD
	    define( function() {
	      return matchesSelector;
	    });
	  } else if ( true ) {
	    module.exports = matchesSelector;
	  }
	  else {
	    // browser global
	    window.matchesSelector = matchesSelector;
	  }

	})( Element.prototype );

	}.call(window));

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/**
	 * Outlayer Item
	 */

	( function( window, factory ) {
	  'use strict';
	  // universal module definition
	  if ( typeof define === 'function' && define.amd ) {
	    // AMD
	    define( [
	        'eventEmitter/EventEmitter',
	        'get-size/get-size',
	        'get-style-property/get-style-property',
	        'fizzy-ui-utils/utils'
	      ],
	      function( EventEmitter, getSize, getStyleProperty, utils ) {
	        return factory( window, EventEmitter, getSize, getStyleProperty, utils );
	      }
	    );
	  } else if (true) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      __webpack_require__(17),
	      __webpack_require__(18),
	      __webpack_require__(25),
	      __webpack_require__(20)
	    );
	  } else {
	    // browser global
	    window.Outlayer = {};
	    window.Outlayer.Item = factory(
	      window,
	      window.EventEmitter,
	      window.getSize,
	      window.getStyleProperty,
	      window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, EventEmitter, getSize, getStyleProperty, utils ) {
	'use strict';

	// ----- helpers ----- //

	var getComputedStyle = window.getComputedStyle;
	var getStyle = getComputedStyle ?
	  function( elem ) {
	    return getComputedStyle( elem, null );
	  } :
	  function( elem ) {
	    return elem.currentStyle;
	  };


	function isEmptyObj( obj ) {
	  for ( var prop in obj ) {
	    return false;
	  }
	  prop = null;
	  return true;
	}

	// -------------------------- CSS3 support -------------------------- //

	var transitionProperty = getStyleProperty('transition');
	var transformProperty = getStyleProperty('transform');
	var supportsCSS3 = transitionProperty && transformProperty;
	var is3d = !!getStyleProperty('perspective');

	var transitionEndEvent = {
	  WebkitTransition: 'webkitTransitionEnd',
	  MozTransition: 'transitionend',
	  OTransition: 'otransitionend',
	  transition: 'transitionend'
	}[ transitionProperty ];

	// properties that could have vendor prefix
	var prefixableProperties = [
	  'transform',
	  'transition',
	  'transitionDuration',
	  'transitionProperty'
	];

	// cache all vendor properties
	var vendorProperties = ( function() {
	  var cache = {};
	  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
	    var prop = prefixableProperties[i];
	    var supportedProp = getStyleProperty( prop );
	    if ( supportedProp && supportedProp !== prop ) {
	      cache[ prop ] = supportedProp;
	    }
	  }
	  return cache;
	})();

	// -------------------------- Item -------------------------- //

	function Item( element, layout ) {
	  if ( !element ) {
	    return;
	  }

	  this.element = element;
	  // parent layout class, i.e. Masonry, Isotope, or Packery
	  this.layout = layout;
	  this.position = {
	    x: 0,
	    y: 0
	  };

	  this._create();
	}

	// inherit EventEmitter
	utils.extend( Item.prototype, EventEmitter.prototype );

	Item.prototype._create = function() {
	  // transition objects
	  this._transn = {
	    ingProperties: {},
	    clean: {},
	    onEnd: {}
	  };

	  this.css({
	    position: 'absolute'
	  });
	};

	// trigger specified handler for event type
	Item.prototype.handleEvent = function( event ) {
	  var method = 'on' + event.type;
	  if ( this[ method ] ) {
	    this[ method ]( event );
	  }
	};

	Item.prototype.getSize = function() {
	  this.size = getSize( this.element );
	};

	/**
	 * apply CSS styles to element
	 * @param {Object} style
	 */
	Item.prototype.css = function( style ) {
	  var elemStyle = this.element.style;

	  for ( var prop in style ) {
	    // use vendor property if available
	    var supportedProp = vendorProperties[ prop ] || prop;
	    elemStyle[ supportedProp ] = style[ prop ];
	  }
	};

	 // measure position, and sets it
	Item.prototype.getPosition = function() {
	  var style = getStyle( this.element );
	  var layoutOptions = this.layout.options;
	  var isOriginLeft = layoutOptions.isOriginLeft;
	  var isOriginTop = layoutOptions.isOriginTop;
	  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
	  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
	  // convert percent to pixels
	  var layoutSize = this.layout.size;
	  var x = xValue.indexOf('%') != -1 ?
	    ( parseFloat( xValue ) / 100 ) * layoutSize.width : parseInt( xValue, 10 );
	  var y = yValue.indexOf('%') != -1 ?
	    ( parseFloat( yValue ) / 100 ) * layoutSize.height : parseInt( yValue, 10 );

	  // clean up 'auto' or other non-integer values
	  x = isNaN( x ) ? 0 : x;
	  y = isNaN( y ) ? 0 : y;
	  // remove padding from measurement
	  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
	  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

	  this.position.x = x;
	  this.position.y = y;
	};

	// set settled position, apply padding
	Item.prototype.layoutPosition = function() {
	  var layoutSize = this.layout.size;
	  var layoutOptions = this.layout.options;
	  var style = {};

	  // x
	  var xPadding = layoutOptions.isOriginLeft ? 'paddingLeft' : 'paddingRight';
	  var xProperty = layoutOptions.isOriginLeft ? 'left' : 'right';
	  var xResetProperty = layoutOptions.isOriginLeft ? 'right' : 'left';

	  var x = this.position.x + layoutSize[ xPadding ];
	  // set in percentage or pixels
	  style[ xProperty ] = this.getXValue( x );
	  // reset other property
	  style[ xResetProperty ] = '';

	  // y
	  var yPadding = layoutOptions.isOriginTop ? 'paddingTop' : 'paddingBottom';
	  var yProperty = layoutOptions.isOriginTop ? 'top' : 'bottom';
	  var yResetProperty = layoutOptions.isOriginTop ? 'bottom' : 'top';

	  var y = this.position.y + layoutSize[ yPadding ];
	  // set in percentage or pixels
	  style[ yProperty ] = this.getYValue( y );
	  // reset other property
	  style[ yResetProperty ] = '';

	  this.css( style );
	  this.emitEvent( 'layout', [ this ] );
	};

	Item.prototype.getXValue = function( x ) {
	  var layoutOptions = this.layout.options;
	  return layoutOptions.percentPosition && !layoutOptions.isHorizontal ?
	    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
	};

	Item.prototype.getYValue = function( y ) {
	  var layoutOptions = this.layout.options;
	  return layoutOptions.percentPosition && layoutOptions.isHorizontal ?
	    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
	};


	Item.prototype._transitionTo = function( x, y ) {
	  this.getPosition();
	  // get current x & y from top/left
	  var curX = this.position.x;
	  var curY = this.position.y;

	  var compareX = parseInt( x, 10 );
	  var compareY = parseInt( y, 10 );
	  var didNotMove = compareX === this.position.x && compareY === this.position.y;

	  // save end position
	  this.setPosition( x, y );

	  // if did not move and not transitioning, just go to layout
	  if ( didNotMove && !this.isTransitioning ) {
	    this.layoutPosition();
	    return;
	  }

	  var transX = x - curX;
	  var transY = y - curY;
	  var transitionStyle = {};
	  transitionStyle.transform = this.getTranslate( transX, transY );

	  this.transition({
	    to: transitionStyle,
	    onTransitionEnd: {
	      transform: this.layoutPosition
	    },
	    isCleaning: true
	  });
	};

	Item.prototype.getTranslate = function( x, y ) {
	  // flip cooridinates if origin on right or bottom
	  var layoutOptions = this.layout.options;
	  x = layoutOptions.isOriginLeft ? x : -x;
	  y = layoutOptions.isOriginTop ? y : -y;

	  if ( is3d ) {
	    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
	  }

	  return 'translate(' + x + 'px, ' + y + 'px)';
	};

	// non transition + transform support
	Item.prototype.goTo = function( x, y ) {
	  this.setPosition( x, y );
	  this.layoutPosition();
	};

	// use transition and transforms if supported
	Item.prototype.moveTo = supportsCSS3 ?
	  Item.prototype._transitionTo : Item.prototype.goTo;

	Item.prototype.setPosition = function( x, y ) {
	  this.position.x = parseInt( x, 10 );
	  this.position.y = parseInt( y, 10 );
	};

	// ----- transition ----- //

	/**
	 * @param {Object} style - CSS
	 * @param {Function} onTransitionEnd
	 */

	// non transition, just trigger callback
	Item.prototype._nonTransition = function( args ) {
	  this.css( args.to );
	  if ( args.isCleaning ) {
	    this._removeStyles( args.to );
	  }
	  for ( var prop in args.onTransitionEnd ) {
	    args.onTransitionEnd[ prop ].call( this );
	  }
	};

	/**
	 * proper transition
	 * @param {Object} args - arguments
	 *   @param {Object} to - style to transition to
	 *   @param {Object} from - style to start transition from
	 *   @param {Boolean} isCleaning - removes transition styles after transition
	 *   @param {Function} onTransitionEnd - callback
	 */
	Item.prototype._transition = function( args ) {
	  // redirect to nonTransition if no transition duration
	  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
	    this._nonTransition( args );
	    return;
	  }

	  var _transition = this._transn;
	  // keep track of onTransitionEnd callback by css property
	  for ( var prop in args.onTransitionEnd ) {
	    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
	  }
	  // keep track of properties that are transitioning
	  for ( prop in args.to ) {
	    _transition.ingProperties[ prop ] = true;
	    // keep track of properties to clean up when transition is done
	    if ( args.isCleaning ) {
	      _transition.clean[ prop ] = true;
	    }
	  }

	  // set from styles
	  if ( args.from ) {
	    this.css( args.from );
	    // force redraw. http://blog.alexmaccaw.com/css-transitions
	    var h = this.element.offsetHeight;
	    // hack for JSHint to hush about unused var
	    h = null;
	  }
	  // enable transition
	  this.enableTransition( args.to );
	  // set styles that are transitioning
	  this.css( args.to );

	  this.isTransitioning = true;

	};

	// dash before all cap letters, including first for
	// WebkitTransform => -webkit-transform
	function toDashedAll( str ) {
	  return str.replace( /([A-Z])/g, function( $1 ) {
	    return '-' + $1.toLowerCase();
	  });
	}

	var transitionProps = 'opacity,' +
	  toDashedAll( vendorProperties.transform || 'transform' );

	Item.prototype.enableTransition = function(/* style */) {
	  // HACK changing transitionProperty during a transition
	  // will cause transition to jump
	  if ( this.isTransitioning ) {
	    return;
	  }

	  // make `transition: foo, bar, baz` from style object
	  // HACK un-comment this when enableTransition can work
	  // while a transition is happening
	  // var transitionValues = [];
	  // for ( var prop in style ) {
	  //   // dash-ify camelCased properties like WebkitTransition
	  //   prop = vendorProperties[ prop ] || prop;
	  //   transitionValues.push( toDashedAll( prop ) );
	  // }
	  // enable transition styles
	  this.css({
	    transitionProperty: transitionProps,
	    transitionDuration: this.layout.options.transitionDuration
	  });
	  // listen for transition end event
	  this.element.addEventListener( transitionEndEvent, this, false );
	};

	Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

	// ----- events ----- //

	Item.prototype.onwebkitTransitionEnd = function( event ) {
	  this.ontransitionend( event );
	};

	Item.prototype.onotransitionend = function( event ) {
	  this.ontransitionend( event );
	};

	// properties that I munge to make my life easier
	var dashedVendorProperties = {
	  '-webkit-transform': 'transform',
	  '-moz-transform': 'transform',
	  '-o-transform': 'transform'
	};

	Item.prototype.ontransitionend = function( event ) {
	  // disregard bubbled events from children
	  if ( event.target !== this.element ) {
	    return;
	  }
	  var _transition = this._transn;
	  // get property name of transitioned property, convert to prefix-free
	  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

	  // remove property that has completed transitioning
	  delete _transition.ingProperties[ propertyName ];
	  // check if any properties are still transitioning
	  if ( isEmptyObj( _transition.ingProperties ) ) {
	    // all properties have completed transitioning
	    this.disableTransition();
	  }
	  // clean style
	  if ( propertyName in _transition.clean ) {
	    // clean up style
	    this.element.style[ event.propertyName ] = '';
	    delete _transition.clean[ propertyName ];
	  }
	  // trigger onTransitionEnd callback
	  if ( propertyName in _transition.onEnd ) {
	    var onTransitionEnd = _transition.onEnd[ propertyName ];
	    onTransitionEnd.call( this );
	    delete _transition.onEnd[ propertyName ];
	  }

	  this.emitEvent( 'transitionEnd', [ this ] );
	};

	Item.prototype.disableTransition = function() {
	  this.removeTransitionStyles();
	  this.element.removeEventListener( transitionEndEvent, this, false );
	  this.isTransitioning = false;
	};

	/**
	 * removes style property from element
	 * @param {Object} style
	**/
	Item.prototype._removeStyles = function( style ) {
	  // clean up transition styles
	  var cleanStyle = {};
	  for ( var prop in style ) {
	    cleanStyle[ prop ] = '';
	  }
	  this.css( cleanStyle );
	};

	var cleanTransitionStyle = {
	  transitionProperty: '',
	  transitionDuration: ''
	};

	Item.prototype.removeTransitionStyles = function() {
	  // remove transition
	  this.css( cleanTransitionStyle );
	};

	// ----- show/hide/remove ----- //

	// remove element from DOM
	Item.prototype.removeElem = function() {
	  this.element.parentNode.removeChild( this.element );
	  // remove display: none
	  this.css({ display: '' });
	  this.emitEvent( 'remove', [ this ] );
	};

	Item.prototype.remove = function() {
	  // just remove element if no transition support or no transition
	  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
	    this.removeElem();
	    return;
	  }

	  // start transition
	  var _this = this;
	  this.once( 'transitionEnd', function() {
	    _this.removeElem();
	  });
	  this.hide();
	};

	Item.prototype.reveal = function() {
	  delete this.isHidden;
	  // remove display: none
	  this.css({ display: '' });

	  var options = this.layout.options;

	  var onTransitionEnd = {};
	  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
	  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

	  this.transition({
	    from: options.hiddenStyle,
	    to: options.visibleStyle,
	    isCleaning: true,
	    onTransitionEnd: onTransitionEnd
	  });
	};

	Item.prototype.onRevealTransitionEnd = function() {
	  // check if still visible
	  // during transition, item may have been hidden
	  if ( !this.isHidden ) {
	    this.emitEvent('reveal');
	  }
	};

	/**
	 * get style property use for hide/reveal transition end
	 * @param {String} styleProperty - hiddenStyle/visibleStyle
	 * @returns {String}
	 */
	Item.prototype.getHideRevealTransitionEndProperty = function( styleProperty ) {
	  var optionStyle = this.layout.options[ styleProperty ];
	  // use opacity
	  if ( optionStyle.opacity ) {
	    return 'opacity';
	  }
	  // get first property
	  for ( var prop in optionStyle ) {
	    return prop;
	  }
	};

	Item.prototype.hide = function() {
	  // set flag
	  this.isHidden = true;
	  // remove display: none
	  this.css({ display: '' });

	  var options = this.layout.options;

	  var onTransitionEnd = {};
	  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
	  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

	  this.transition({
	    from: options.visibleStyle,
	    to: options.hiddenStyle,
	    // keep hidden stuff hidden
	    isCleaning: true,
	    onTransitionEnd: onTransitionEnd
	  });
	};

	Item.prototype.onHideTransitionEnd = function() {
	  // check if still hidden
	  // during transition, item may have been un-hidden
	  if ( this.isHidden ) {
	    this.css({ display: 'none' });
	    this.emitEvent('hide');
	  }
	};

	Item.prototype.destroy = function() {
	  this.css({
	    position: '',
	    left: '',
	    right: '',
	    top: '',
	    bottom: '',
	    transition: '',
	    transform: ''
	  });
	};

	return Item;

	}));

	}.call(window));

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * getStyleProperty v1.0.4
	 * original by kangax
	 * http://perfectionkills.com/feature-testing-css-properties/
	 * MIT license
	 */

	/*jshint browser: true, strict: true, undef: true */
	/*global define: false, exports: false, module: false */

	( function( window ) {

	'use strict';

	var prefixes = 'Webkit Moz ms Ms O'.split(' ');
	var docElemStyle = document.documentElement.style;

	function getStyleProperty( propName ) {
	  if ( !propName ) {
	    return;
	  }

	  // test standard property first
	  if ( typeof docElemStyle[ propName ] === 'string' ) {
	    return propName;
	  }

	  // capitalize
	  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

	  // test vendor specific properties
	  var prefixed;
	  for ( var i=0, len = prefixes.length; i < len; i++ ) {
	    prefixed = prefixes[i] + propName;
	    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
	      return prefixed;
	    }
	  }
	}

	// transport
	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( function() {
	    return getStyleProperty;
	  });
	} else if ( true ) {
	  // CommonJS for Component
	  module.exports = getStyleProperty;
	} else {
	  // browser global
	  window.getStyleProperty = getStyleProperty;
	}

	})( window );

	}.call(window));

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * imagesLoaded v3.2.0
	 * JavaScript is all like "You images are done yet or what?"
	 * MIT License
	 */

	( function( window, factory ) { 'use strict';
	  // universal module definition

	  /*global define: false, module: false, require: false */

	  if ( typeof define == 'function' && define.amd ) {
	    // AMD
	    define( [
	      'eventEmitter/EventEmitter',
	      'eventie/eventie'
	    ], function( EventEmitter, eventie ) {
	      return factory( window, EventEmitter, eventie );
	    });
	  } else if ( typeof module == 'object' && module.exports ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      __webpack_require__(27),
	      __webpack_require__(28)
	    );
	  } else {
	    // browser global
	    window.imagesLoaded = factory(
	      window,
	      window.EventEmitter,
	      window.eventie
	    );
	  }

	})( window,

	// --------------------------  factory -------------------------- //

	function factory( window, EventEmitter, eventie ) {

	'use strict';

	var $ = window.jQuery;
	var console = window.console;

	// -------------------------- helpers -------------------------- //

	// extend objects
	function extend( a, b ) {
	  for ( var prop in b ) {
	    a[ prop ] = b[ prop ];
	  }
	  return a;
	}

	var objToString = Object.prototype.toString;
	function isArray( obj ) {
	  return objToString.call( obj ) == '[object Array]';
	}

	// turn element or nodeList into an array
	function makeArray( obj ) {
	  var ary = [];
	  if ( isArray( obj ) ) {
	    // use object if already an array
	    ary = obj;
	  } else if ( typeof obj.length == 'number' ) {
	    // convert nodeList to array
	    for ( var i=0; i < obj.length; i++ ) {
	      ary.push( obj[i] );
	    }
	  } else {
	    // array of single index
	    ary.push( obj );
	  }
	  return ary;
	}

	  // -------------------------- imagesLoaded -------------------------- //

	  /**
	   * @param {Array, Element, NodeList, String} elem
	   * @param {Object or Function} options - if function, use as callback
	   * @param {Function} onAlways - callback function
	   */
	  function ImagesLoaded( elem, options, onAlways ) {
	    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
	    if ( !( this instanceof ImagesLoaded ) ) {
	      return new ImagesLoaded( elem, options, onAlways );
	    }
	    // use elem as selector string
	    if ( typeof elem == 'string' ) {
	      elem = document.querySelectorAll( elem );
	    }

	    this.elements = makeArray( elem );
	    this.options = extend( {}, this.options );

	    if ( typeof options == 'function' ) {
	      onAlways = options;
	    } else {
	      extend( this.options, options );
	    }

	    if ( onAlways ) {
	      this.on( 'always', onAlways );
	    }

	    this.getImages();

	    if ( $ ) {
	      // add jQuery Deferred object
	      this.jqDeferred = new $.Deferred();
	    }

	    // HACK check async to allow time to bind listeners
	    var _this = this;
	    setTimeout( function() {
	      _this.check();
	    });
	  }

	  ImagesLoaded.prototype = new EventEmitter();

	  ImagesLoaded.prototype.options = {};

	  ImagesLoaded.prototype.getImages = function() {
	    this.images = [];

	    // filter & find items if we have an item selector
	    for ( var i=0; i < this.elements.length; i++ ) {
	      var elem = this.elements[i];
	      this.addElementImages( elem );
	    }
	  };

	  /**
	   * @param {Node} element
	   */
	  ImagesLoaded.prototype.addElementImages = function( elem ) {
	    // filter siblings
	    if ( elem.nodeName == 'IMG' ) {
	      this.addImage( elem );
	    }
	    // get background image on element
	    if ( this.options.background === true ) {
	      this.addElementBackgroundImages( elem );
	    }

	    // find children
	    // no non-element nodes, #143
	    var nodeType = elem.nodeType;
	    if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
	      return;
	    }
	    var childImgs = elem.querySelectorAll('img');
	    // concat childElems to filterFound array
	    for ( var i=0; i < childImgs.length; i++ ) {
	      var img = childImgs[i];
	      this.addImage( img );
	    }

	    // get child background images
	    if ( typeof this.options.background == 'string' ) {
	      var children = elem.querySelectorAll( this.options.background );
	      for ( i=0; i < children.length; i++ ) {
	        var child = children[i];
	        this.addElementBackgroundImages( child );
	      }
	    }
	  };

	  var elementNodeTypes = {
	    1: true,
	    9: true,
	    11: true
	  };

	  ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
	    var style = getStyle( elem );
	    // get url inside url("...")
	    var reURL = /url\(['"]*([^'"\)]+)['"]*\)/gi;
	    var matches = reURL.exec( style.backgroundImage );
	    while ( matches !== null ) {
	      var url = matches && matches[1];
	      if ( url ) {
	        this.addBackground( url, elem );
	      }
	      matches = reURL.exec( style.backgroundImage );
	    }
	  };

	  // IE8
	  var getStyle = window.getComputedStyle || function( elem ) {
	    return elem.currentStyle;
	  };

	  /**
	   * @param {Image} img
	   */
	  ImagesLoaded.prototype.addImage = function( img ) {
	    var loadingImage = new LoadingImage( img );
	    this.images.push( loadingImage );
	  };

	  ImagesLoaded.prototype.addBackground = function( url, elem ) {
	    var background = new Background( url, elem );
	    this.images.push( background );
	  };

	  ImagesLoaded.prototype.check = function() {
	    var _this = this;
	    this.progressedCount = 0;
	    this.hasAnyBroken = false;
	    // complete if no images
	    if ( !this.images.length ) {
	      this.complete();
	      return;
	    }

	    function onProgress( image, elem, message ) {
	      // HACK - Chrome triggers event before object properties have changed. #83
	      setTimeout( function() {
	        _this.progress( image, elem, message );
	      });
	    }

	    for ( var i=0; i < this.images.length; i++ ) {
	      var loadingImage = this.images[i];
	      loadingImage.once( 'progress', onProgress );
	      loadingImage.check();
	    }
	  };

	  ImagesLoaded.prototype.progress = function( image, elem, message ) {
	    this.progressedCount++;
	    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
	    // progress event
	    this.emit( 'progress', this, image, elem );
	    if ( this.jqDeferred && this.jqDeferred.notify ) {
	      this.jqDeferred.notify( this, image );
	    }
	    // check if completed
	    if ( this.progressedCount == this.images.length ) {
	      this.complete();
	    }

	    if ( this.options.debug && console ) {
	      console.log( 'progress: ' + message, image, elem );
	    }
	  };

	  ImagesLoaded.prototype.complete = function() {
	    var eventName = this.hasAnyBroken ? 'fail' : 'done';
	    this.isComplete = true;
	    this.emit( eventName, this );
	    this.emit( 'always', this );
	    if ( this.jqDeferred ) {
	      var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
	      this.jqDeferred[ jqMethod ]( this );
	    }
	  };

	  // --------------------------  -------------------------- //

	  function LoadingImage( img ) {
	    this.img = img;
	  }

	  LoadingImage.prototype = new EventEmitter();

	  LoadingImage.prototype.check = function() {
	    // If complete is true and browser supports natural sizes,
	    // try to check for image status manually.
	    var isComplete = this.getIsImageComplete();
	    if ( isComplete ) {
	      // report based on naturalWidth
	      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
	      return;
	    }

	    // If none of the checks above matched, simulate loading on detached element.
	    this.proxyImage = new Image();
	    eventie.bind( this.proxyImage, 'load', this );
	    eventie.bind( this.proxyImage, 'error', this );
	    // bind to image as well for Firefox. #191
	    eventie.bind( this.img, 'load', this );
	    eventie.bind( this.img, 'error', this );
	    this.proxyImage.src = this.img.src;
	  };

	  LoadingImage.prototype.getIsImageComplete = function() {
	    return this.img.complete && this.img.naturalWidth !== undefined;
	  };

	  LoadingImage.prototype.confirm = function( isLoaded, message ) {
	    this.isLoaded = isLoaded;
	    this.emit( 'progress', this, this.img, message );
	  };

	  // ----- events ----- //

	  // trigger specified handler for event type
	  LoadingImage.prototype.handleEvent = function( event ) {
	    var method = 'on' + event.type;
	    if ( this[ method ] ) {
	      this[ method ]( event );
	    }
	  };

	  LoadingImage.prototype.onload = function() {
	    this.confirm( true, 'onload' );
	    this.unbindEvents();
	  };

	  LoadingImage.prototype.onerror = function() {
	    this.confirm( false, 'onerror' );
	    this.unbindEvents();
	  };

	  LoadingImage.prototype.unbindEvents = function() {
	    eventie.unbind( this.proxyImage, 'load', this );
	    eventie.unbind( this.proxyImage, 'error', this );
	    eventie.unbind( this.img, 'load', this );
	    eventie.unbind( this.img, 'error', this );
	  };

	  // -------------------------- Background -------------------------- //

	  function Background( url, element ) {
	    this.url = url;
	    this.element = element;
	    this.img = new Image();
	  }

	  // inherit LoadingImage prototype
	  Background.prototype = new LoadingImage();

	  Background.prototype.check = function() {
	    eventie.bind( this.img, 'load', this );
	    eventie.bind( this.img, 'error', this );
	    this.img.src = this.url;
	    // check if image is already complete
	    var isComplete = this.getIsImageComplete();
	    if ( isComplete ) {
	      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
	      this.unbindEvents();
	    }
	  };

	  Background.prototype.unbindEvents = function() {
	    eventie.unbind( this.img, 'load', this );
	    eventie.unbind( this.img, 'error', this );
	  };

	  Background.prototype.confirm = function( isLoaded, message ) {
	    this.isLoaded = isLoaded;
	    this.emit( 'progress', this, this.element, message );
	  };

	  // -------------------------- jQuery -------------------------- //

	  ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
	    jQuery = jQuery || window.jQuery;
	    if ( !jQuery ) {
	      return;
	    }
	    // set local variable
	    $ = jQuery;
	    // $().imagesLoaded()
	    $.fn.imagesLoaded = function( options, callback ) {
	      var instance = new ImagesLoaded( this, options, callback );
	      return instance.jqDeferred.promise( $(this) );
	    };
	  };
	  // try making plugin
	  ImagesLoaded.makeJQueryPlugin();

	  // --------------------------  -------------------------- //

	  return ImagesLoaded;

	});

	}.call(window));

/***/ },
/* 27 */
/***/ function(module, exports) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * EventEmitter v4.2.11 - git.io/ee
	 * Unlicense - http://unlicense.org/
	 * Oliver Caldwell - http://oli.me.uk/
	 * @preserve
	 */

	;(function () {
	    'use strict';

	    /**
	     * Class for managing events.
	     * Can be extended to provide event functionality in other classes.
	     *
	     * @class EventEmitter Manages event registering and emitting.
	     */
	    function EventEmitter() {}

	    // Shortcuts to improve speed and size
	    var proto = EventEmitter.prototype;
	    var exports = this;
	    var originalGlobalValue = exports.EventEmitter;

	    /**
	     * Finds the index of the listener for the event in its storage array.
	     *
	     * @param {Function[]} listeners Array of listeners to search through.
	     * @param {Function} listener Method to look for.
	     * @return {Number} Index of the specified listener, -1 if not found
	     * @api private
	     */
	    function indexOfListener(listeners, listener) {
	        var i = listeners.length;
	        while (i--) {
	            if (listeners[i].listener === listener) {
	                return i;
	            }
	        }

	        return -1;
	    }

	    /**
	     * Alias a method while keeping the context correct, to allow for overwriting of target method.
	     *
	     * @param {String} name The name of the target method.
	     * @return {Function} The aliased method
	     * @api private
	     */
	    function alias(name) {
	        return function aliasClosure() {
	            return this[name].apply(this, arguments);
	        };
	    }

	    /**
	     * Returns the listener array for the specified event.
	     * Will initialise the event object and listener arrays if required.
	     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	     * Each property in the object response is an array of listener functions.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Function[]|Object} All listener functions for the event.
	     */
	    proto.getListeners = function getListeners(evt) {
	        var events = this._getEvents();
	        var response;
	        var key;

	        // Return a concatenated array of all matching events if
	        // the selector is a regular expression.
	        if (evt instanceof RegExp) {
	            response = {};
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    response[key] = events[key];
	                }
	            }
	        }
	        else {
	            response = events[evt] || (events[evt] = []);
	        }

	        return response;
	    };

	    /**
	     * Takes a list of listener objects and flattens it into a list of listener functions.
	     *
	     * @param {Object[]} listeners Raw listener objects.
	     * @return {Function[]} Just the listener functions.
	     */
	    proto.flattenListeners = function flattenListeners(listeners) {
	        var flatListeners = [];
	        var i;

	        for (i = 0; i < listeners.length; i += 1) {
	            flatListeners.push(listeners[i].listener);
	        }

	        return flatListeners;
	    };

	    /**
	     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	     *
	     * @param {String|RegExp} evt Name of the event to return the listeners from.
	     * @return {Object} All listener functions for an event in an object.
	     */
	    proto.getListenersAsObject = function getListenersAsObject(evt) {
	        var listeners = this.getListeners(evt);
	        var response;

	        if (listeners instanceof Array) {
	            response = {};
	            response[evt] = listeners;
	        }

	        return response || listeners;
	    };

	    /**
	     * Adds a listener function to the specified event.
	     * The listener will not be added if it is a duplicate.
	     * If the listener returns true then it will be removed after it is called.
	     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListener = function addListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var listenerIsWrapped = typeof listener === 'object';
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
	                listeners[key].push(listenerIsWrapped ? listener : {
	                    listener: listener,
	                    once: false
	                });
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of addListener
	     */
	    proto.on = alias('addListener');

	    /**
	     * Semi-alias of addListener. It will add a listener that will be
	     * automatically removed after its first execution.
	     *
	     * @param {String|RegExp} evt Name of the event to attach the listener to.
	     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addOnceListener = function addOnceListener(evt, listener) {
	        return this.addListener(evt, {
	            listener: listener,
	            once: true
	        });
	    };

	    /**
	     * Alias of addOnceListener.
	     */
	    proto.once = alias('addOnceListener');

	    /**
	     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	     * You need to tell it what event names should be matched by a regex.
	     *
	     * @param {String} evt Name of the event to create.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvent = function defineEvent(evt) {
	        this.getListeners(evt);
	        return this;
	    };

	    /**
	     * Uses defineEvent to define multiple events.
	     *
	     * @param {String[]} evts An array of event names to define.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.defineEvents = function defineEvents(evts) {
	        for (var i = 0; i < evts.length; i += 1) {
	            this.defineEvent(evts[i]);
	        }
	        return this;
	    };

	    /**
	     * Removes a listener function from the specified event.
	     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to remove the listener from.
	     * @param {Function} listener Method to remove from the event.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListener = function removeListener(evt, listener) {
	        var listeners = this.getListenersAsObject(evt);
	        var index;
	        var key;

	        for (key in listeners) {
	            if (listeners.hasOwnProperty(key)) {
	                index = indexOfListener(listeners[key], listener);

	                if (index !== -1) {
	                    listeners[key].splice(index, 1);
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of removeListener
	     */
	    proto.off = alias('removeListener');

	    /**
	     * Adds listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	     * You can also pass it a regular expression to add the array of listeners to all events that match it.
	     * Yeah, this function does quite a bit. That's probably a bad thing.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.addListeners = function addListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(false, evt, listeners);
	    };

	    /**
	     * Removes listeners in bulk using the manipulateListeners method.
	     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be removed.
	     * You can also pass it a regular expression to remove the listeners from all events that match it.
	     *
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeListeners = function removeListeners(evt, listeners) {
	        // Pass through to manipulateListeners
	        return this.manipulateListeners(true, evt, listeners);
	    };

	    /**
	     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	     * The first argument will determine if the listeners are removed (true) or added (false).
	     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	     * You can also pass it an event name and an array of listeners to be added/removed.
	     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	     *
	     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
	        var i;
	        var value;
	        var single = remove ? this.removeListener : this.addListener;
	        var multiple = remove ? this.removeListeners : this.addListeners;

	        // If evt is an object then pass each of its properties to this method
	        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
	            for (i in evt) {
	                if (evt.hasOwnProperty(i) && (value = evt[i])) {
	                    // Pass the single listener straight through to the singular method
	                    if (typeof value === 'function') {
	                        single.call(this, i, value);
	                    }
	                    else {
	                        // Otherwise pass back to the multiple function
	                        multiple.call(this, i, value);
	                    }
	                }
	            }
	        }
	        else {
	            // So evt must be a string
	            // And listeners must be an array of listeners
	            // Loop over it and pass each one to the multiple method
	            i = listeners.length;
	            while (i--) {
	                single.call(this, evt, listeners[i]);
	            }
	        }

	        return this;
	    };

	    /**
	     * Removes all listeners from a specified event.
	     * If you do not specify an event then all listeners will be removed.
	     * That means every event will be emptied.
	     * You can also pass a regex to remove all events that match it.
	     *
	     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.removeEvent = function removeEvent(evt) {
	        var type = typeof evt;
	        var events = this._getEvents();
	        var key;

	        // Remove different things depending on the state of evt
	        if (type === 'string') {
	            // Remove all listeners for the specified event
	            delete events[evt];
	        }
	        else if (evt instanceof RegExp) {
	            // Remove all events matching the regex.
	            for (key in events) {
	                if (events.hasOwnProperty(key) && evt.test(key)) {
	                    delete events[key];
	                }
	            }
	        }
	        else {
	            // Remove all listeners in all events
	            delete this._events;
	        }

	        return this;
	    };

	    /**
	     * Alias of removeEvent.
	     *
	     * Added to mirror the node API.
	     */
	    proto.removeAllListeners = alias('removeEvent');

	    /**
	     * Emits an event of your choice.
	     * When emitted, every listener attached to that event will be executed.
	     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	     * So they will not arrive within the array on the other side, they will be separate.
	     * You can also pass a regular expression to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {Array} [args] Optional array of arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emitEvent = function emitEvent(evt, args) {
	        var listenersMap = this.getListenersAsObject(evt);
	        var listeners;
	        var listener;
	        var i;
	        var key;
	        var response;

	        for (key in listenersMap) {
	            if (listenersMap.hasOwnProperty(key)) {
	                listeners = listenersMap[key].slice(0);
	                i = listeners.length;

	                while (i--) {
	                    // If the listener returns true then it shall be removed from the event
	                    // The function is executed either with a basic call or an apply if there is an args array
	                    listener = listeners[i];

	                    if (listener.once === true) {
	                        this.removeListener(evt, listener.listener);
	                    }

	                    response = listener.listener.apply(this, args || []);

	                    if (response === this._getOnceReturnValue()) {
	                        this.removeListener(evt, listener.listener);
	                    }
	                }
	            }
	        }

	        return this;
	    };

	    /**
	     * Alias of emitEvent
	     */
	    proto.trigger = alias('emitEvent');

	    /**
	     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	     *
	     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	     * @param {...*} Optional additional arguments to be passed to each listener.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.emit = function emit(evt) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        return this.emitEvent(evt, args);
	    };

	    /**
	     * Sets the current value to check against when executing listeners. If a
	     * listeners return value matches the one set here then it will be removed
	     * after execution. This value defaults to true.
	     *
	     * @param {*} value The new value to check for when executing listeners.
	     * @return {Object} Current instance of EventEmitter for chaining.
	     */
	    proto.setOnceReturnValue = function setOnceReturnValue(value) {
	        this._onceReturnValue = value;
	        return this;
	    };

	    /**
	     * Fetches the current value to check against when executing listeners. If
	     * the listeners return value matches this one then it should be removed
	     * automatically. It will return true by default.
	     *
	     * @return {*|Boolean} The current value to check for or the default, true.
	     * @api private
	     */
	    proto._getOnceReturnValue = function _getOnceReturnValue() {
	        if (this.hasOwnProperty('_onceReturnValue')) {
	            return this._onceReturnValue;
	        }
	        else {
	            return true;
	        }
	    };

	    /**
	     * Fetches the events object and creates one if required.
	     *
	     * @return {Object} The events storage object.
	     * @api private
	     */
	    proto._getEvents = function _getEvents() {
	        return this._events || (this._events = {});
	    };

	    /**
	     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
	     *
	     * @return {Function} Non conflicting EventEmitter class.
	     */
	    EventEmitter.noConflict = function noConflict() {
	        exports.EventEmitter = originalGlobalValue;
	        return EventEmitter;
	    };

	    // Expose the class either via AMD, CommonJS or the global object
	    if (typeof define === 'function' && define.amd) {
	        define(function () {
	            return EventEmitter;
	        });
	    }
	    else if (typeof module === 'object' && module.exports){
	        module.exports = EventEmitter;
	    }
	    else {
	        exports.EventEmitter = EventEmitter;
	    }
	}.call(this));

	}.call(window));

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/*** IMPORTS FROM imports-loader ***/
	var define = false;
	(function() {

	/*!
	 * eventie v1.0.6
	 * event binding helper
	 *   eventie.bind( elem, 'click', myFn )
	 *   eventie.unbind( elem, 'click', myFn )
	 * MIT license
	 */

	/*jshint browser: true, undef: true, unused: true */
	/*global define: false, module: false */

	( function( window ) {

	'use strict';

	var docElem = document.documentElement;

	var bind = function() {};

	function getIEEvent( obj ) {
	  var event = window.event;
	  // add event.target
	  event.target = event.target || event.srcElement || obj;
	  return event;
	}

	if ( docElem.addEventListener ) {
	  bind = function( obj, type, fn ) {
	    obj.addEventListener( type, fn, false );
	  };
	} else if ( docElem.attachEvent ) {
	  bind = function( obj, type, fn ) {
	    obj[ type + fn ] = fn.handleEvent ?
	      function() {
	        var event = getIEEvent( obj );
	        fn.handleEvent.call( fn, event );
	      } :
	      function() {
	        var event = getIEEvent( obj );
	        fn.call( obj, event );
	      };
	    obj.attachEvent( "on" + type, obj[ type + fn ] );
	  };
	}

	var unbind = function() {};

	if ( docElem.removeEventListener ) {
	  unbind = function( obj, type, fn ) {
	    obj.removeEventListener( type, fn, false );
	  };
	} else if ( docElem.detachEvent ) {
	  unbind = function( obj, type, fn ) {
	    obj.detachEvent( "on" + type, obj[ type + fn ] );
	    try {
	      delete obj[ type + fn ];
	    } catch ( err ) {
	      // can't delete window object properties
	      obj[ type + fn ] = undefined;
	    }
	  };
	}

	var eventie = {
	  bind: bind,
	  unbind: unbind
	};

	// ----- module definition ----- //

	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( eventie );
	} else if ( true ) {
	  // CommonJS
	  module.exports = eventie;
	} else {
	  // browser global
	  window.eventie = eventie;
	}

	})( window );

	}.call(window));

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var ComponentEvent = (function (_super) {
	    __extends(ComponentEvent, _super);
	    function ComponentEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    ComponentEvent.ALL_ITEMS_READY = "com.cortex.core.component.event.ComponentEvent::ALL_ITEMS_READY";
	    return ComponentEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ComponentEvent;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(1);
	var ComponentEvent_1 = __webpack_require__(29);
	var ListComponent = (function (_super) {
	    __extends(ListComponent, _super);
	    function ListComponent() {
	        _super.call(this);
	    }
	    ListComponent.prototype.Init = function (aComponentListID) {
	        this.mComponentBindings = new Array();
	        this.mComponentCreated = 0;
	        this.mComponentListHTML = document.getElementById(aComponentListID);
	    };
	    ListComponent.prototype.Destroy = function () {
	        this.mComponentBindings.length = 0;
	        this.mComponentBindings = null;
	        this.mComponentListHTML = null;
	    };
	    Object.defineProperty(ListComponent.prototype, "ComponentListHTML", {
	        get: function () { return (this.mComponentListHTML); },
	        enumerable: true,
	        configurable: true
	    });
	    ListComponent.prototype.GetComponentBindings = function () { return this.mComponentBindings; };
	    ListComponent.prototype.GetBindingByComponent = function (aComponent) {
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            if (this.mComponentBindings[i].View == aComponent) {
	                return (this.mComponentBindings[i]);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.AreAllComponentsLoaded = function () {
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            if (!this.mComponentBindings[i].IsLoaded) {
	                return (false);
	            }
	        }
	        return (true);
	    };
	    ListComponent.prototype.GetDataByID = function (aID) {
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            if (this.mComponentBindings[i].Data.ID == aID) {
	                return (this.mComponentBindings[i].Data);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.GetComponentByData = function (aData) {
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            if (this.mComponentBindings[i].Data == aData) {
	                return (this.mComponentBindings[i].View);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.GetComponentByID = function (aID) {
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            if (this.mComponentBindings[i].Data.ID == aID) {
	                return (this.mComponentBindings[i].View);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.AddComponent = function (aComponentBinding, aKeepID) {
	        if (aKeepID === void 0) { aKeepID = false; }
	        if (this.mComponentBindings.indexOf(aComponentBinding) >= 0) {
	            if (aComponentBinding.IsRendered) {
	                aComponentBinding.IsAdded = true;
	                this.mComponentListHTML.appendChild(aComponentBinding.HTML);
	            }
	            else {
	                this.RenderComponents();
	            }
	            return;
	        }
	        if (!aKeepID) {
	            aComponentBinding.Data.ID = this.mComponentCreated.toString();
	            this.mComponentCreated++;
	        }
	        this.mComponentBindings.push(aComponentBinding);
	    };
	    ListComponent.prototype.RemoveComponent = function (aComponentBinding, aPurge) {
	        if (aPurge === void 0) { aPurge = false; }
	        if (aPurge) {
	            this.mComponentBindings.splice(this.mComponentBindings.indexOf(aComponentBinding), 1);
	        }
	        if (aComponentBinding.IsAdded) {
	            this.mComponentListHTML.removeChild(aComponentBinding.HTML);
	        }
	        aComponentBinding.IsAdded = false;
	    };
	    ListComponent.prototype.RemoveAllComponents = function (aPurge) {
	        if (aPurge === void 0) { aPurge = false; }
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = componentBindingsLength - 1; i >= 0; i--) {
	            this.RemoveComponent(this.mComponentBindings[i], aPurge);
	        }
	    };
	    ListComponent.prototype.LoadWithTemplate = function (aTemplate, aForceReload) {
	        if (aTemplate === void 0) { aTemplate = ""; }
	        if (aForceReload === void 0) { aForceReload = false; }
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            if (this.mComponentBindings[i].IsLoaded && !aForceReload) {
	                continue;
	            }
	            var view = this.mComponentBindings[i].View;
	            view.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);
	            view.LoadTemplate((this.mComponentBindings[i].Template != null) ? this.mComponentBindings[i].Template : aTemplate);
	        }
	    };
	    ListComponent.prototype.OnComponentTemplateLoaded = function (aEvent) {
	        var componentView = aEvent.target;
	        componentView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);
	        var componentBinding = this.GetBindingByComponent(componentView);
	        componentBinding.IsLoaded = true;
	        if (!this.AreAllComponentsLoaded()) {
	            return;
	        }
	        this.RenderComponents();
	        this.DispatchEvent(new ComponentEvent_1.default(ComponentEvent_1.default.ALL_ITEMS_READY));
	    };
	    ListComponent.prototype.RenderComponents = function () {
	        var componentBindingsLength = this.mComponentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            var componentBinding = this.mComponentBindings[i];
	            if (componentBinding.IsRendered) {
	                continue;
	            }
	            componentBinding.IsRendered = true;
	            componentBinding.IsAdded = true;
	            this.RenderElement(componentBinding.View.RenderTemplate(componentBinding.Data));
	        }
	    };
	    ListComponent.prototype.RenderElement = function (aTemplate) {
	        this.mComponentListHTML.insertAdjacentHTML("beforeend", aTemplate);
	    };
	    return ListComponent;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ListComponent;


/***/ },
/* 31 */
/***/ function(module, exports) {

	var ComponentBinding = (function () {
	    function ComponentBinding(aView, aData, aTemplate) {
	        if (aTemplate === void 0) { aTemplate = null; }
	        this.mIsLoaded = false;
	        this.mIsRendered = false;
	        this.mIsAdded = false;
	        this.mView = aView;
	        this.mData = aData;
	        this.mTemplate = aTemplate;
	    }
	    Object.defineProperty(ComponentBinding.prototype, "View", {
	        get: function () { return this.mView; },
	        set: function (aValue) { this.mView = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ComponentBinding.prototype, "Data", {
	        get: function () { return this.mData; },
	        set: function (aValue) { this.mData = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ComponentBinding.prototype, "Template", {
	        get: function () { return this.mTemplate; },
	        set: function (aValue) { this.mTemplate = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ComponentBinding.prototype, "HTML", {
	        get: function () { return this.mHTML; },
	        set: function (aValue) { this.mHTML = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ComponentBinding.prototype, "IsLoaded", {
	        get: function () { return this.mIsLoaded; },
	        set: function (aValue) { this.mIsLoaded = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ComponentBinding.prototype, "IsRendered", {
	        get: function () { return this.mIsRendered; },
	        set: function (aValue) { this.mIsRendered = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ComponentBinding.prototype, "IsAdded", {
	        get: function () { return this.mIsAdded; },
	        set: function (aValue) { this.mIsAdded = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    return ComponentBinding;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ComponentBinding;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var MouseTouchEvent = (function (_super) {
	    __extends(MouseTouchEvent, _super);
	    function MouseTouchEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    MouseTouchEvent.TOUCHED = "com.cortex.core.mouse.event.MouseTouchEvent::TEMPLATE_CLICKED";
	    return MouseTouchEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MouseTouchEvent;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var cortex_toolkit_js_net_1 = __webpack_require__(34);
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MVCEvent_1 = __webpack_require__(6);
	var TouchBehavior_1 = __webpack_require__(38);
	var Templating_1 = __webpack_require__(40);
	var AbstractView = (function (_super) {
	    __extends(AbstractView, _super);
	    function AbstractView(aID) {
	        if (aID === void 0) { aID = ""; }
	        _super.call(this);
	        this.mID = aID;
	    }
	    AbstractView.prototype.Destroy = function () {
	        if (this.mTouchBehavior != null) {
	            this.mTouchBehavior.Destroy();
	        }
	        this.mTouchBehavior = null;
	        this.mData = null;
	        this.mTemplateHTML = null;
	    };
	    AbstractView.prototype.LoadTemplate = function (aTemplatePath) {
	        var _this = this;
	        var promise = cortex_toolkit_js_net_1.LazyLoader.loadTemplate(aTemplatePath);
	        promise.then(function () { return _this.OnTemplateLoaded(promise.result); });
	    };
	    Object.defineProperty(AbstractView.prototype, "Data", {
	        get: function () { return this.mData; },
	        set: function (aData) { this.mData = aData; },
	        enumerable: true,
	        configurable: true
	    });
	    AbstractView.prototype.RenderTemplate = function (aData) {
	        this.Data = aData;
	        if (this.mTemplate == "") {
	            this.mTemplateHTML = "TEMPLATE IS EMPTY";
	        }
	        else {
	            this.mTemplateHTML = Templating_1.default.Render(this.mTemplate, aData);
	        }
	        return this.mTemplateHTML;
	    };
	    AbstractView.prototype.AddClickControl = function (aElement) {
	        if (this.mTouchBehavior == null) {
	            this.mTouchBehavior = new TouchBehavior_1.default();
	            this.mTouchBehavior.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnTouched, this);
	        }
	        this.mTouchBehavior.AddClickControl(aElement);
	    };
	    AbstractView.prototype.RemoveClickControl = function (aElement) {
	        this.mTouchBehavior.RemoveClickControl(aElement);
	    };
	    Object.defineProperty(AbstractView.prototype, "ID", {
	        get: function () { return (this.mID); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(AbstractView.prototype, "Template", {
	        get: function () { return (this.mTemplate); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(AbstractView.prototype, "TemplateHTML", {
	        get: function () { return (this.mTemplateHTML); },
	        enumerable: true,
	        configurable: true
	    });
	    AbstractView.prototype.OnTemplateLoaded = function (aTemplate) {
	        this.mTemplate = aTemplate;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    AbstractView.prototype.OnTouched = function (aEvent) {
	        this.DispatchEvent(aEvent);
	    };
	    return AbstractView;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AbstractView;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// Export stuff from sub modules
	//
	var LazyLoader_1 = __webpack_require__(35);
	exports.LazyLoader = LazyLoader_1.default;
	var BrowserDetector_1 = __webpack_require__(37);
	exports.BrowserDetector = BrowserDetector_1.default;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/***
	 *
	 * Provides a simple way to use Promise with XHR Callback
	 *
	 * @copyright Cortex Media 2015
	 *
	 * @author Mathieu Rhéaume
	 *
	 */
	var P = __webpack_require__(36);
	/**
	 * @classdesc Provides a simple way to use Promise with XHR Callback
	 */
	var LazyLoader = (function () {
	    function LazyLoader() {
	    }
	    /**
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {string} aFile - Path of the file to fetch
	     * @param {string} aApiToken - Token to add in Autorization header if used in beaver token
	     * @param {object} aDatastoreObject - A Datastore object to cache the XHR Response.
	     */
	    LazyLoader.loadJSON = function (aFile, aApiToken, aDatastoreObject) {
	        var deferObject = P.defer();
	        if (aDatastoreObject != null && aDatastoreObject.get(aFile) != null) {
	            deferObject.resolve(aDatastoreObject.get(aFile));
	        }
	        else {
	            //<Review> this should be a function
	            //<Review> Might want to wrap the request in something custom as you do a lot
	            // of treatement that similar in all three functions
	            var xhr = new XMLHttpRequest();
	            //</Review>
	            xhr.open("GET", aFile, true);
	            try {
	                xhr.responseType = "json";
	            }
	            catch (e) {
	                // WebKit added support for the json responseType value on 09/03/2013
	                // https://bugs.webkit.org/show_bug.cgi?id=73648. Versions of Safari prior to 7 are
	                // known to throw when setting the value "json" as the response type. Other older
	                // browsers implementing the responseType
	                //
	                // The json response type can be ignored if not supported, because JSON payloads are
	                // parsed on the client-side regardless.
	                if (xhr.responseType !== "json" && xhr.responseText !== "json") {
	                }
	            }
	            if (aApiToken !== undefined && aApiToken.length > 0) {
	                xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
	            }
	            xhr.onerror = function (error) {
	                deferObject.reject(error);
	            };
	            xhr.onload = function () {
	                if (xhr.response !== null) {
	                    var objToReturn;
	                    if (typeof (xhr.response) === "string") {
	                        objToReturn = JSON.parse(xhr.response);
	                    }
	                    else {
	                        objToReturn = xhr.response;
	                    }
	                    if (aDatastoreObject !== undefined) {
	                        aDatastoreObject.set(aFile, objToReturn);
	                    }
	                    deferObject.resolve(objToReturn);
	                }
	                else {
	                    deferObject.reject(new Error("No valid JSON object was found (" +
	                        xhr.status + " " + xhr.statusText + ")"));
	                }
	            };
	            xhr.send();
	        }
	        return deferObject.promise();
	    };
	    /**
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {string} aFile - Path of the file to fetch
	     */
	    LazyLoader.loadFile = function (aFile) {
	        var deferObject = P.defer(), xhr = new XMLHttpRequest();
	        xhr.open("GET", aFile, true);
	        xhr.onerror = function (error) {
	            deferObject.reject(error);
	        };
	        xhr.onload = function () {
	            if (xhr.response !== null) {
	                var objToReturn;
	                if (typeof (xhr.response) === "string") {
	                    objToReturn = JSON.parse(xhr.response);
	                }
	                else {
	                    objToReturn = xhr.response;
	                }
	                deferObject.resolve(objToReturn);
	            }
	            else {
	                deferObject.reject(new Error("No valid JSON object was found (" +
	                    xhr.status + " " + xhr.statusText + ")"));
	            }
	        };
	        xhr.send();
	        return deferObject.promise();
	    };
	    /**
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {string} aFile - Path of the file to fetch
	     */
	    LazyLoader.loadTemplate = function (aFile) {
	        var deferObject = P.defer(), xhr = new XMLHttpRequest();
	        xhr.open("GET", aFile, true);
	        xhr.onerror = function (error) {
	            deferObject.reject(error);
	        };
	        xhr.onload = function () {
	            if (xhr.response !== null) {
	                deferObject.resolve(xhr.response);
	            }
	            else {
	                deferObject.reject(new Error("No valid JSON object was found (" +
	                    xhr.status + " " + xhr.statusText + ")"));
	            }
	        };
	        xhr.send();
	        return deferObject.promise();
	    };
	    /**
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {string} aFile - Path of the file to fetch
	     * @param {object} aJsonObject - Json object to send
	     * @param {boolean} aSyncOrNot - Execute the request in sync or async mode.
	     * @param {string} aApiToken - Token to use in autorization header.
	     */
	    LazyLoader.sendJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
	        var deferObject = P.defer(), xhr = this.getXHRObject("POST", aFile, aSyncOrNot, aApiToken);
	        xhr.onerror = function (error) {
	            deferObject.reject(error);
	        };
	        xhr.onload = function () {
	            LazyLoader.handleXHRReponse(xhr, deferObject);
	        };
	        xhr.send(JSON.stringify(aJsonObject));
	        return deferObject.promise();
	    };
	    /**
	     * Realise a PUT (UPDATE) Operation from a provided Json Object.
	     *
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {string} aFile - Path of the file to fetch
	     * @param {any} aJsonObject - JSON Object to send.
	     * @param {boolean} aSyncOrNot - Execute the request in sync or async mode.
	     * @param {string} aApiToken - Token to use in autorization header.
	     */
	    LazyLoader.updateJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
	        var deferObject = P.defer(), xhr = this.getXHRObject("PUT", aFile, aSyncOrNot, aApiToken);
	        xhr.onerror = function (error) {
	            deferObject.reject(error);
	        };
	        xhr.onload = function () {
	            LazyLoader.handleXHRReponse(xhr, deferObject);
	        };
	        xhr.send(JSON.stringify(aJsonObject));
	        return deferObject.promise();
	    };
	    LazyLoader.deleteRequest = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
	        var deferObject = P.defer();
	        var xhr = this.getXHRObject("DELETE", aFile, aSyncOrNot, aApiToken);
	        xhr.onerror = function (error) {
	            deferObject.reject(error);
	        };
	        xhr.onload = function () {
	            deferObject.resolve(xhr.status);
	        };
	        xhr.send();
	        return deferObject.promise();
	    };
	    /**
	     * Handles callback from XHR Query and Parse the JSON from query...
	     *
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {XMLHttpRequest} aXhrObject - Object used to do the query
	     * @param {Defer} aDeferObject - Object from promise your currently running...
	     */
	    LazyLoader.handleXHRReponse = function (requestObject, aDeferObject) {
	        var requestResponse = requestObject.response;
	        if (requestResponse !== null) {
	            var objToReturn;
	            if (typeof (requestResponse) === "string" && requestResponse !== "") {
	                objToReturn = JSON.parse(requestResponse);
	            }
	            else {
	                objToReturn = requestResponse;
	            }
	            aDeferObject.resolve(objToReturn);
	        }
	        else {
	            aDeferObject.reject(new Error("No valid JSON object was found (" +
	                requestObject.status + " " + requestObject.statusText + ")"));
	        }
	    };
	    /**
	     * Initialize a XMLHttpRequest object with the required headers for a JSON Object Operation
	     *
	     * @memberof com.cortex.core.net.LazyLoader
	     * @param {string} aHttpOperation - HTTP Operation to do
	     * @param {string} aFile - Path of the file to fetch
	     * @param {boolean} aSyncOrNot - Execute the request in sync or async mode.
	     * @param {string} aApiToken - Token to use in autorization header.
	     */
	    LazyLoader.getXHRObject = function (aHttpOperation, aFile, aSyncOrNot, aApiToken) {
	        var xhr = new XMLHttpRequest;
	        xhr.open(aHttpOperation, aFile, aSyncOrNot);
	        if (aApiToken !== undefined && aApiToken.length > 0) {
	            xhr.setRequestHeader("Authorization", "Token token=" + aApiToken);
	        }
	        xhr.setRequestHeader("Accept", "application/json");
	        xhr.setRequestHeader("Content-Type", "application/json");
	        return xhr;
	    };
	    return LazyLoader;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = LazyLoader;


/***/ },
/* 36 */
/***/ function(module, exports) {

	/**
	    Module P: Generic Promises for TypeScript

	    Project, documentation, and license: https://github.com/pragmatrix/Promise
	*/
	var P;
	(function (P) {
	    /**
	        Returns a new "Deferred" value that may be resolved or rejected.
	    */
	    function defer() {
	        return new DeferredI();
	    }
	    P.defer = defer;
	    /**
	        Converts a value to a resolved promise.
	    */
	    function resolve(v) {
	        return defer().resolve(v).promise();
	    }
	    P.resolve = resolve;
	    /**
	        Returns a rejected promise.
	    */
	    function reject(err) {
	        return defer().reject(err).promise();
	    }
	    P.reject = reject;
	    /**
	        http://en.wikipedia.org/wiki/Anamorphism

	        Given a seed value, unfold calls the unspool function, waits for the returned promise to be resolved, and then
	        calls it again if a next seed value was returned.

	        All the values of all promise results are collected into the resulting promise which is resolved as soon
	        the last generated element value is resolved.
	    */
	    function unfold(unspool, seed) {
	        var d = defer();
	        var elements = new Array();
	        unfoldCore(elements, d, unspool, seed);
	        return d.promise();
	    }
	    P.unfold = unfold;
	    function unfoldCore(elements, deferred, unspool, seed) {
	        var result = unspool(seed);
	        if (!result) {
	            deferred.resolve(elements);
	            return;
	        }
	        // fastpath: don't waste stack space if promise resolves immediately.
	        while (result.next && result.promise.status == P.Status.Resolved) {
	            elements.push(result.promise.result);
	            result = unspool(result.next);
	            if (!result) {
	                deferred.resolve(elements);
	                return;
	            }
	        }
	        result.promise
	            .done(function (v) {
	            elements.push(v);
	            if (!result.next)
	                deferred.resolve(elements);
	            else
	                unfoldCore(elements, deferred, unspool, result.next);
	        })
	            .fail(function (e) {
	            deferred.reject(e);
	        });
	    }
	    /**
	        The status of a Promise. Initially a Promise is Unfulfilled and may
	        change to Rejected or Resolved.
	     
	        Once a promise is either Rejected or Resolved, it can not change its
	        status anymore.
	    */
	    (function (Status) {
	        Status[Status["Unfulfilled"] = 0] = "Unfulfilled";
	        Status[Status["Rejected"] = 1] = "Rejected";
	        Status[Status["Resolved"] = 2] = "Resolved";
	    })(P.Status || (P.Status = {}));
	    var Status = P.Status;
	    /**
	        Creates a promise that gets resolved when all the promises in the argument list get resolved.
	        As soon one of the arguments gets rejected, the resulting promise gets rejected.
	        If no promises were provided, the resulting promise is immediately resolved.
	    */
	    function when() {
	        var promises = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            promises[_i - 0] = arguments[_i];
	        }
	        var allDone = defer();
	        if (!promises.length) {
	            allDone.resolve([]);
	            return allDone.promise();
	        }
	        var resolved = 0;
	        var results = [];
	        promises.forEach(function (p, i) {
	            p
	                .done(function (v) {
	                results[i] = v;
	                ++resolved;
	                if (resolved === promises.length && allDone.status !== Status.Rejected)
	                    allDone.resolve(results);
	            })
	                .fail(function (e) {
	                if (allDone.status !== Status.Rejected)
	                    allDone.reject(new Error("when: one or more promises were rejected"));
	            });
	        });
	        return allDone.promise();
	    }
	    P.when = when;
	    /**
	        Implementation of a promise.

	        The Promise<Value> instance is a proxy to the Deferred<Value> instance.
	    */
	    var PromiseI = (function () {
	        function PromiseI(deferred) {
	            this.deferred = deferred;
	        }
	        Object.defineProperty(PromiseI.prototype, "status", {
	            get: function () { return this.deferred.status; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(PromiseI.prototype, "result", {
	            get: function () { return this.deferred.result; },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(PromiseI.prototype, "error", {
	            get: function () { return this.deferred.error; },
	            enumerable: true,
	            configurable: true
	        });
	        PromiseI.prototype.done = function (f) {
	            this.deferred.done(f);
	            return this;
	        };
	        PromiseI.prototype.fail = function (f) {
	            this.deferred.fail(f);
	            return this;
	        };
	        PromiseI.prototype.always = function (f) {
	            this.deferred.always(f);
	            return this;
	        };
	        PromiseI.prototype.then = function (f) {
	            return this.deferred.then(f);
	        };
	        return PromiseI;
	    })();
	    /**
	        Implementation of a deferred.
	    */
	    var DeferredI = (function () {
	        function DeferredI() {
	            this._resolved = function (_) { };
	            this._rejected = function (_) { };
	            this._status = Status.Unfulfilled;
	            this._error = { message: "" };
	            this._promise = new PromiseI(this);
	        }
	        DeferredI.prototype.promise = function () {
	            return this._promise;
	        };
	        Object.defineProperty(DeferredI.prototype, "status", {
	            get: function () {
	                return this._status;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(DeferredI.prototype, "result", {
	            get: function () {
	                if (this._status != Status.Resolved)
	                    throw new Error("Promise: result not available");
	                return this._result;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        Object.defineProperty(DeferredI.prototype, "error", {
	            get: function () {
	                if (this._status != Status.Rejected)
	                    throw new Error("Promise: rejection reason not available");
	                return this._error;
	            },
	            enumerable: true,
	            configurable: true
	        });
	        DeferredI.prototype.then = function (f) {
	            var d = defer();
	            this
	                .done(function (v) {
	                var promiseOrValue = f(v);
	                // todo: need to find another way to check if r is really of interface
	                // type Promise<any>, otherwise we would not support other 
	                // implementations here.
	                if (promiseOrValue instanceof PromiseI) {
	                    var p = promiseOrValue;
	                    p.done(function (v2) { return d.resolve(v2); })
	                        .fail(function (err) { return d.reject(err); });
	                    return p;
	                }
	                d.resolve(promiseOrValue);
	            })
	                .fail(function (err) { return d.reject(err); });
	            return d.promise();
	        };
	        DeferredI.prototype.done = function (f) {
	            if (this.status === Status.Resolved) {
	                f(this._result);
	                return this;
	            }
	            if (this.status !== Status.Unfulfilled)
	                return this;
	            var prev = this._resolved;
	            this._resolved = function (v) { prev(v); f(v); };
	            return this;
	        };
	        DeferredI.prototype.fail = function (f) {
	            if (this.status === Status.Rejected) {
	                f(this._error);
	                return this;
	            }
	            if (this.status !== Status.Unfulfilled)
	                return this;
	            var prev = this._rejected;
	            this._rejected = function (e) { prev(e); f(e); };
	            return this;
	        };
	        DeferredI.prototype.always = function (f) {
	            this
	                .done(function (v) { return f(v); })
	                .fail(function (err) { return f(null, err); });
	            return this;
	        };
	        DeferredI.prototype.resolve = function (result) {
	            if (this._status !== Status.Unfulfilled)
	                throw new Error("tried to resolve a fulfilled promise");
	            this._result = result;
	            this._status = Status.Resolved;
	            this._resolved(result);
	            this.detach();
	            return this;
	        };
	        DeferredI.prototype.reject = function (err) {
	            if (this._status !== Status.Unfulfilled)
	                throw new Error("tried to reject a fulfilled promise");
	            this._error = err;
	            this._status = Status.Rejected;
	            this._rejected(err);
	            this.detach();
	            return this;
	        };
	        DeferredI.prototype.detach = function () {
	            this._resolved = function (_) { };
	            this._rejected = function (_) { };
	        };
	        return DeferredI;
	    })();
	    function generator(g) {
	        return function () { return iterator(g()); };
	    }
	    P.generator = generator;
	    ;
	    function iterator(f) {
	        return new IteratorI(f);
	    }
	    P.iterator = iterator;
	    var IteratorI = (function () {
	        function IteratorI(f) {
	            this.f = f;
	            this.current = undefined;
	        }
	        IteratorI.prototype.advance = function () {
	            var _this = this;
	            var res = this.f();
	            return res.then(function (value) {
	                if (isUndefined(value))
	                    return false;
	                _this.current = value;
	                return true;
	            });
	        };
	        return IteratorI;
	    })();
	    /**
	        Iterator functions.
	    */
	    function each(gen, f) {
	        var d = defer();
	        eachCore(d, gen(), f);
	        return d.promise();
	    }
	    P.each = each;
	    function eachCore(fin, it, f) {
	        it.advance()
	            .done(function (hasValue) {
	            if (!hasValue) {
	                fin.resolve({});
	                return;
	            }
	            f(it.current);
	            eachCore(fin, it, f);
	        })
	            .fail(function (err) { return fin.reject(err); });
	    }
	    /**
	        std
	    */
	    function isUndefined(v) {
	        return typeof v === 'undefined';
	    }
	    P.isUndefined = isUndefined;
	})(P || (P = {}));
	module.exports = P;


/***/ },
/* 37 */
/***/ function(module, exports) {

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
	var BrowserDetector = (function () {
	    function BrowserDetector() {
	        /*** CONSTRUCTOR GOES HERE **/
	    }
	    /**
	     * @description     Detect if browser is internet explorer
	     *
	     * @return          {Boolean} Returns true if internet explorer else false
	     *
	     * @memberof        com.cortex.core.browsers.BrowserDetector
	     */
	    BrowserDetector.DetectInternetExplorer = function () {
	        if ((navigator.appName != null &&
	            navigator.appName === BrowserDetector.IE_APP_NAME ||
	            navigator.appName === BrowserDetector.IE_11_APP_NAME) &&
	            BrowserDetector.ExtractIEVersion() >= BrowserDetector.IE_MIN_VER_NUMBER) {
	            return true;
	        }
	        return false;
	    };
	    /**
	     * @description     Get internet explorer versions
	     *
	     * @return          {Float} Returns internet explorer versions and -1 if not IE.
	     *
	     * @memberof        com.cortex.core.browsers.BrowserDetector
	     */
	    BrowserDetector.GetInternetExplorerVersion = function () {
	        if (this.DetectInternetExplorer() === true) {
	            return BrowserDetector.ExtractIEVersion();
	        }
	        return -1;
	    };
	    BrowserDetector.ExtractIEVersion = function () {
	        if (BrowserDetector.IE_REGEX_VERSIONS.exec(navigator.userAgent) != null) {
	            return parseFloat(RegExp.$1);
	        }
	        else if (BrowserDetector.IE_11_REGEX_VERSIONS.exec(navigator.userAgent) != null) {
	            return parseFloat(RegExp.$1);
	        }
	    };
	    BrowserDetector.IE_APP_NAME = "Microsoft Internet Explorer";
	    BrowserDetector.IE_11_APP_NAME = "Netscape";
	    BrowserDetector.IE_MIN_VER_NUMBER = 9;
	    BrowserDetector.IE_REGEX_VERSIONS = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	    BrowserDetector.IE_11_REGEX_VERSIONS = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
	    return BrowserDetector;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BrowserDetector;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MouseSwipeEvent_1 = __webpack_require__(4);
	var Point_1 = __webpack_require__(39);
	var TouchBehavior = (function (_super) {
	    __extends(TouchBehavior, _super);
	    function TouchBehavior() {
	        _super.call(this);
	        this.mElementList = new Array();
	        this.mMousePosition = new Point_1.default();
	    }
	    TouchBehavior.prototype.Destroy = function () {
	        for (var i = 0; i < this.mElementList.length; i++) {
	            this.RemoveClickControl(this.mElementList[i]);
	        }
	        this.mElementList.length = 0;
	        this.mElementList = null;
	        this.mLastTouchEvent = null;
	        this.mMousePosition = null;
	    };
	    TouchBehavior.prototype.AddClickControl = function (aElement) {
	        this.mElementList.push(aElement);
	        aElement.addEventListener("touchstart", this.OnTouchStart.bind(this));
	        aElement.addEventListener("touchmove", this.OnTouchMove.bind(this));
	        aElement.addEventListener("touchend", this.OnTouchEnd.bind(this));
	        aElement.addEventListener("mousedown", this.OnMouseDown.bind(this));
	        aElement.addEventListener("mousemove", this.OnMouseMove.bind(this));
	        aElement.addEventListener("mouseup", this.OnMouseUp.bind(this));
	    };
	    TouchBehavior.prototype.RemoveClickControl = function (aElement) {
	        var elementIndex = this.mElementList.indexOf(aElement);
	        var element = this.mElementList[elementIndex];
	        element.removeEventListener("touchstart", this.OnTouchStart.bind(this));
	        element.removeEventListener("touchmove", this.OnTouchMove.bind(this));
	        element.removeEventListener("touchend", this.OnTouchEnd.bind(this));
	        element.removeEventListener("mousedown", this.OnMouseDown.bind(this));
	        element.removeEventListener("mousemove", this.OnMouseMove.bind(this));
	        element.removeEventListener("mouseup", this.OnMouseUp.bind(this));
	        this.mElementList.splice(elementIndex, 1);
	    };
	    TouchBehavior.prototype.OnMouseDown = function (aEvent) {
	        if (this.mLastTouchEvent != null) {
	            return;
	        }
	        ;
	        this.mTouchTarget = aEvent.target;
	        this.DispatchSwipeEvent(MouseSwipeEvent_1.default.SWIPE_BEGIN, aEvent);
	    };
	    TouchBehavior.prototype.OnMouseMove = function (aEvent) {
	        if (this.mLastTouchEvent != null) {
	            return;
	        }
	        ;
	        this.DispatchSwipeEvent(MouseSwipeEvent_1.default.SWIPE_MOVE, aEvent);
	    };
	    TouchBehavior.prototype.OnMouseUp = function (aEvent) {
	        if (this.mLastTouchEvent == null) {
	            this.DispatchSwipeEvent(MouseSwipeEvent_1.default.SWIPE_END, aEvent);
	        }
	        if (this.mLastTouchEvent != null || aEvent.target !== this.mTouchTarget) {
	            return;
	        }
	        ;
	        var touchEvent = new MouseTouchEvent_1.default(MouseTouchEvent_1.default.TOUCHED);
	        touchEvent.target = aEvent.target;
	        touchEvent.currentTarget = aEvent.currentTarget;
	        this.DispatchEvent(touchEvent);
	        this.mTouchTarget = null;
	    };
	    TouchBehavior.prototype.OnTouchStart = function (aEvent) {
	        this.mLastTouchEvent = aEvent;
	        this.mTouchTarget = aEvent.target;
	        var firstTouch = aEvent.targetTouches.item(0);
	        this.mMousePosition.X = firstTouch.clientX || firstTouch.pageX;
	        this.mMousePosition.Y = firstTouch.clientY || firstTouch.pageY;
	        this.DispatchSwipeEvent(MouseSwipeEvent_1.default.SWIPE_BEGIN, firstTouch);
	    };
	    TouchBehavior.prototype.OnTouchMove = function (aEvent) {
	        this.mLastTouchEvent = aEvent;
	        this.DispatchSwipeEvent(MouseSwipeEvent_1.default.SWIPE_MOVE, aEvent.targetTouches.item(0));
	    };
	    TouchBehavior.prototype.OnTouchEnd = function (aEvent) {
	        aEvent.preventDefault();
	        var endTouch = this.mLastTouchEvent.targetTouches.item(0);
	        var endTouchX = endTouch.clientX || endTouch.pageX;
	        var endTouchY = endTouch.clientY || endTouch.pageY;
	        if (this.mTouchTarget === aEvent.target &&
	            this.mMousePosition.X === endTouchX &&
	            this.mMousePosition.Y === endTouchY) {
	            var touchEvent = new MouseTouchEvent_1.default(MouseTouchEvent_1.default.TOUCHED);
	            touchEvent.target = aEvent.target;
	            touchEvent.currentTarget = aEvent.currentTarget;
	            this.DispatchEvent(touchEvent);
	            this.mTouchTarget = null;
	        }
	        this.DispatchSwipeEvent(MouseSwipeEvent_1.default.SWIPE_END, endTouch);
	    };
	    TouchBehavior.prototype.DispatchSwipeEvent = function (aType, aSource) {
	        var event = new MouseSwipeEvent_1.default(aType);
	        event.locationX = aSource.clientX || aSource.pageX;
	        this.DispatchEvent(event);
	    };
	    return TouchBehavior;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TouchBehavior;


/***/ },
/* 39 */
/***/ function(module, exports) {

	var Point = (function () {
	    function Point(aX, aY) {
	        if (aX === void 0) { aX = 0; }
	        if (aY === void 0) { aY = 0; }
	        this.mX = aX;
	        this.mY = aY;
	    }
	    Point.prototype.Clone = function () {
	        return (new Point(this.mX, this.mY));
	    };
	    Object.defineProperty(Point.prototype, "X", {
	        get: function () { return (this.mX); },
	        set: function (aValue) { this.mX = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Point.prototype, "Y", {
	        get: function () { return (this.mY); },
	        set: function (aValue) { this.mY = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Point.prototype.Add = function (aPoint) {
	        this.mX += aPoint.X;
	        this.mY += aPoint.Y;
	        return this;
	    };
	    Point.prototype.Subtract = function (aPoint) {
	        this.mX -= aPoint.X;
	        this.mY -= aPoint.Y;
	        return this;
	    };
	    Point.prototype.Multiply = function (aValue) {
	        this.mX *= aValue;
	        this.mY *= aValue;
	        return this;
	    };
	    Point.prototype.Invert = function () {
	        this.mX *= -1;
	        this.mY *= -1;
	        return this;
	    };
	    Point.prototype.IsEqual = function (aPoint) {
	        return this.mX === aPoint.X && this.mY === aPoint.Y;
	    };
	    Point.prototype.toString = function () {
	        return (this.mX + ", " + this.mY);
	    };
	    return Point;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Point;


/***/ },
/* 40 */
/***/ function(module, exports) {

	var Templating = (function () {
	    function Templating() {
	    }
	    Templating.Render = function (aTemplate, aData) {
	        var f = !/[^\w\-\.:]/.test(aTemplate) ? Templating.cache[aTemplate] = Templating.cache[aTemplate] ||
	            Templating.Render(Templating.load(aTemplate)) :
	            new Function(Templating.arg + ",Templating", "var _e=Templating.encode" +
	                Templating.helper +
	                ",_s='" +
	                aTemplate.replace(Templating.regexp, this.func) +
	                "';return _s;");
	        return aData ? f(aData, this) : function (aData) {
	            return f(aData, this);
	        };
	    };
	    Templating.load = function (id) {
	        return document.getElementById(id).innerHTML;
	    };
	    Templating.func = function (s, p1, p2, p3, p4, p5) {
	        if (p1) {
	            return {
	                "\n": "\\n",
	                "\r": "\\r",
	                "\t": "\\t",
	                " ": " "
	            }[p1] || "\\" + p1;
	        }
	        if (p2) {
	            if (p2 === "=") {
	                return "'+_e(" + p3 + ")+'";
	            }
	            return "'+(" + p3 + "==null?'':" + p3 + ")+'";
	        }
	        if (p4) {
	            return "';";
	        }
	        if (p5) {
	            return "_s+='";
	        }
	    };
	    Templating.encode = function (s) {
	        return (s == null ? "" : "" + s).replace(Templating.encReg, function (c) {
	            return Templating.encMap[c] || "";
	        });
	    };
	    Templating.cache = {};
	    Templating.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g;
	    Templating.encReg = /[<>&"'\x00]/g;
	    Templating.encMap = {
	        "<": "&lt;",
	        ">": "&gt;",
	        "&": "&amp;",
	        "\"": "&quot;",
	        "'": "&#39;"
	    };
	    Templating.arg = "o";
	    Templating.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);},include=function(s,d){_s+=tmpl(s,d);}";
	    return Templating;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Templating;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractModel_1 = __webpack_require__(42);
	var BlogPost_1 = __webpack_require__(43);
	var Profile_1 = __webpack_require__(45);
	var cortex_toolkit_js_net_1 = __webpack_require__(34);
	var EConfig_1 = __webpack_require__(10);
	var Spinner_1 = __webpack_require__(46);
	var BlogModel = (function (_super) {
	    __extends(BlogModel, _super);
	    function BlogModel() {
	        _super.call(this);
	        this.mBlogPosts = [];
	        this.mAuthors = [];
	    }
	    BlogModel.prototype.FetchBlogPosts = function () {
	        var _this = this;
	        Spinner_1.default.GetInstance().Show();
	        if (this.mAuthors.length <= 0) {
	            var promise = cortex_toolkit_js_net_1.LazyLoader.loadJSON(EConfig_1.default.BASE_URL + "users");
	            promise.then(function (results) { _this.OnAuthorURLLoaded(results); });
	        }
	        else {
	            this.Fetch(EConfig_1.default.BASE_URL + "posts?per_page=" + EConfig_1.default.PER_PAGE);
	        }
	    };
	    BlogModel.prototype.OnAuthorURLLoaded = function (aJSONData) {
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var author = new Profile_1.default();
	            var nameParts = json[i].name.split(" ");
	            author.profileID = json[i].id;
	            author.firstName = nameParts[0];
	            author.lastName = nameParts[1];
	            author.description = json[i].description;
	            author.facebook = json[i].url;
	            author.thumbnail = json[i].avatar_urls["96"];
	            this.mAuthors.push(author);
	        }
	        this.FetchBlogPosts();
	    };
	    BlogModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        var _this = this;
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var blogPost = new BlogPost_1.default();
	            blogPost.FromJSON(json[i]);
	            blogPost.profile = this.GetAuthorByID(blogPost.profileID);
	            this.mBlogPosts.push(blogPost);
	        }
	        for (var i = 0, iMax = this.mBlogPosts.length; i < iMax; i++) {
	            var blogPost = this.mBlogPosts[i];
	            if (blogPost.thumbnailID == 0) {
	                this.OnImageURLLoaded({ id: "0", source_url: "img/blog/blog-placeholder-1.jpg" });
	            }
	            else {
	                var promise = cortex_toolkit_js_net_1.LazyLoader.loadJSON(EConfig_1.default.BASE_URL + "media/" + blogPost.thumbnailID);
	                promise.then(function (results) { _this.OnImageURLLoaded(results); });
	            }
	        }
	    };
	    BlogModel.prototype.GetAuthorByID = function (aProfileID) {
	        for (var i = 0, max = this.mAuthors.length; i < max; i++) {
	            if (this.mAuthors[i].profileID == aProfileID) {
	                return this.mAuthors[i];
	            }
	        }
	        return null;
	    };
	    BlogModel.prototype.OnImageURLLoaded = function (aJSONData) {
	        for (var i = 0, max = this.mBlogPosts.length; i < max; i++) {
	            var blogPost = this.mBlogPosts[i];
	            if (blogPost.thumbnailID == aJSONData.id && !blogPost.ready) {
	                blogPost.thumbnail = aJSONData.source_url;
	                blogPost.ready = true;
	                break;
	            }
	        }
	        var allImageLoaded = true;
	        for (var i = 0, max = this.mBlogPosts.length; i < max; i++) {
	            if (!this.mBlogPosts[i].ready) {
	                allImageLoaded = false;
	                break;
	            }
	        }
	        if (allImageLoaded) {
	            _super.prototype.OnJSONLoadSuccess.call(this, this.mBlogPosts, EConfig_1.default.BASE_URL + "posts");
	            Spinner_1.default.GetInstance().Hide();
	            this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	        }
	    };
	    BlogModel.prototype.GetBlogPosts = function () {
	        return this.mBlogPosts.slice(0, this.mBlogPosts.length);
	    };
	    BlogModel.GetInstance = function () {
	        if (BlogModel.mInstance == null) {
	            BlogModel.mInstance = new BlogModel();
	        }
	        return BlogModel.mInstance;
	    };
	    return BlogModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BlogModel;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var cortex_toolkit_js_net_1 = __webpack_require__(34);
	var AbstractModel = (function (_super) {
	    __extends(AbstractModel, _super);
	    function AbstractModel() {
	        this.mDataCache = {};
	        _super.call(this);
	    }
	    AbstractModel.prototype.Fetch = function (aURL, aForceRefresh) {
	        var _this = this;
	        if (aForceRefresh === void 0) { aForceRefresh = false; }
	        if (!aForceRefresh && this.mDataCache[aURL] != null) {
	            this.OnJSONLoadSuccess(this.mDataCache[aURL], aURL);
	            return;
	        }
	        var promise = cortex_toolkit_js_net_1.LazyLoader.loadJSON(aURL);
	        promise.then(function () { return _this.OnJSONLoadSuccess(promise.result, aURL); });
	        promise.fail(function () { return _this.OnJSONLoadError(aURL); });
	    };
	    AbstractModel.prototype.GetData = function (aURL) {
	        return this.mDataCache[aURL];
	    };
	    AbstractModel.prototype.OnJSONLoadError = function (aURL) {
	        console.log("There was an error loading, ", aURL);
	    };
	    AbstractModel.prototype.OnJSONLoadSuccess = function (aData, aURL) {
	        this.mDataCache[aURL] = aData;
	    };
	    return AbstractModel;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AbstractModel;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var Profile_1 = __webpack_require__(45);
	var BlogPost = (function (_super) {
	    __extends(BlogPost, _super);
	    function BlogPost() {
	        _super.call(this);
	        this.mProfile = new Profile_1.default();
	    }
	    Object.defineProperty(BlogPost.prototype, "title", {
	        get: function () { return this.mTitle; },
	        set: function (aTitle) { this.mTitle = aTitle; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "slug", {
	        get: function () { return this.mSlug; },
	        set: function (aValue) { this.mSlug = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "profileID", {
	        get: function () { return this.mProfileID; },
	        set: function (aValue) { this.mProfileID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "profile", {
	        get: function () { return this.mProfile; },
	        set: function (aValue) { this.mProfile = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "description", {
	        get: function () { return this.mDescription; },
	        set: function (aDescription) { this.mDescription = aDescription; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "thumbnailID", {
	        get: function () { return this.mThumbnailID; },
	        set: function (aValue) { this.mThumbnailID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "thumbnail", {
	        get: function () { return this.mThumbnail; },
	        set: function (aThumbnail) { this.mThumbnail = aThumbnail; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "datePublished", {
	        get: function () { return this.mDatePublished; },
	        set: function (aDatePublished) { this.mDatePublished = aDatePublished; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "text", {
	        get: function () { return this.mText; },
	        set: function (aText) { this.mText = aText; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BlogPost.prototype, "ready", {
	        get: function () { return this.mReady; },
	        set: function (aValue) { this.mReady = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    BlogPost.prototype.FromJSON = function (aData) {
	        var div = document.createElement("div");
	        div.innerHTML = aData.title.rendered;
	        this.mTitle = div.textContent;
	        this.mSlug = aData.slug;
	        this.mProfileID = aData.author;
	        this.mDescription = aData.description;
	        this.mThumbnailID = aData.featured_image;
	        this.mDatePublished = aData.date;
	        this.mText = aData.content.rendered;
	    };
	    return BlogPost;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BlogPost;


/***/ },
/* 44 */
/***/ function(module, exports) {

	var ComponentData = (function () {
	    function ComponentData() {
	    }
	    Object.defineProperty(ComponentData.prototype, "ID", {
	        get: function () { return this.mID; },
	        set: function (aValue) { this.mID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    ComponentData.prototype.FromJSON = function (aData) {
	        this.mData = aData;
	    };
	    ComponentData.prototype.ToJSON = function () {
	        return (this.mData);
	    };
	    return ComponentData;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ComponentData;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var Profile = (function (_super) {
	    __extends(Profile, _super);
	    function Profile() {
	        _super.call(this);
	        this.mPhoto = "";
	        this.mThumbnail = "";
	    }
	    Object.defineProperty(Profile.prototype, "profileID", {
	        get: function () { return this.mProfileID; },
	        set: function (aValue) { this.mProfileID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "parentId", {
	        get: function () { return this.mParentId; },
	        set: function (aValue) { this.mParentId = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "companyID", {
	        get: function () { return this.mCompanyID; },
	        set: function (aValue) { this.mCompanyID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "firstName", {
	        get: function () { return this.mFirstName; },
	        set: function (aValue) { this.mFirstName = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "lastName", {
	        get: function () { return this.mLastName; },
	        set: function (aValue) { this.mLastName = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "subtitle", {
	        get: function () { return this.mSubtitle; },
	        set: function (aValue) { this.mSubtitle = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "slug", {
	        get: function () { return this.mSlug; },
	        set: function (aValue) { this.mSlug = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "linkSlug", {
	        get: function () { return this.mLinkSlug; },
	        set: function (aValue) { this.mLinkSlug = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "photo", {
	        get: function () { return this.mPhoto; },
	        set: function (aValue) { this.mPhoto = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "thumbnail", {
	        get: function () { return this.mThumbnail; },
	        set: function (aValue) { this.mThumbnail = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "description", {
	        get: function () { return this.mDescription; },
	        set: function (aValue) { this.mDescription = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "twitter", {
	        get: function () { return this.mTwitter; },
	        set: function (aValue) { this.mTwitter = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "facebook", {
	        get: function () { return this.mFacebook; },
	        set: function (aValue) { this.mFacebook = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "linkedIn", {
	        get: function () { return this.mLinkedIn; },
	        set: function (aValue) { this.mLinkedIn = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Profile.prototype, "order", {
	        get: function () { return this.mOrder; },
	        set: function (aOrder) { this.mOrder = aOrder; },
	        enumerable: true,
	        configurable: true
	    });
	    Profile.prototype.FromJSON = function (aData) {
	        var div = document.createElement("div");
	        div.innerHTML = aData.title.rendered;
	        var name = div.textContent.split(" ");
	        this.mProfileID = aData.id;
	        this.mSlug = aData.slug;
	        this.mFirstName = name[0];
	        this.mLastName = name.splice(1, name.length).join(" ");
	        this.mDescription = !aData.waq_meta.description ? aData.content.rendered : aData.waq_meta.description;
	        this.mSubtitle = !aData.waq_meta._conferencer_title ? "" : aData.waq_meta._conferencer_title[0];
	        this.mSubtitle = !aData.waq_meta.committee ? this.mSubtitle : aData.waq_meta.committee[0];
	        this.mCompanyID = !aData.waq_meta._conferencer_company ? "" : aData.waq_meta._conferencer_company[0];
	        var customFields = aData.acf;
	        this.mPhoto = !customFields.image_presentation ? "" : customFields.image_presentation.url;
	        this.mThumbnail = !customFields.image_thumbnail ? "" : customFields.image_thumbnail.url;
	        this.mTwitter = !customFields.twitter ? "" : "https://twitter.com/" + customFields.twitter;
	        this.mFacebook = !customFields.facebook ? "" : customFields.facebook;
	        this.mLinkedIn = !customFields.linkedin ? "" : customFields.linkedin;
	        this.mOrder = !aData.waq_meta._conferencer_order ? 0 : Number(aData.waq_meta._conferencer_order[0]);
	    };
	    return Profile;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Profile;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var Spinner = (function (_super) {
	    __extends(Spinner, _super);
	    function Spinner() {
	        _super.call(this);
	    }
	    Spinner.prototype.SetContent = function () {
	        if (this.mContentCurrent == null) {
	            this.mContentCurrent = document.getElementById("content-current");
	        }
	        if (this.mContentLoading == null) {
	            this.mContentLoading = document.getElementById("content-loading");
	        }
	    };
	    Spinner.prototype.Show = function () {
	        this.SetContent();
	        if (this.mContentCurrent != null && this.mContentLoading != null) {
	            this.mContentCurrent.classList.add("is-showingSpinner");
	            this.mContentLoading.classList.add("is-showingSpinner");
	        }
	    };
	    Spinner.prototype.Hide = function () {
	        this.SetContent();
	        if (this.mContentCurrent != null && this.mContentLoading != null) {
	            this.mContentCurrent.classList.remove("is-showingSpinner");
	            this.mContentLoading.classList.remove("is-showingSpinner");
	        }
	    };
	    Spinner.GetInstance = function () {
	        if (Spinner.mInstance == null) {
	            Spinner.mInstance = new Spinner();
	        }
	        return Spinner.mInstance;
	    };
	    return Spinner;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Spinner;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AbstractModel_1 = __webpack_require__(42);
	var Profile_1 = __webpack_require__(45);
	var ProfileEvent_1 = __webpack_require__(48);
	var cortex_toolkit_js_net_1 = __webpack_require__(34);
	var EConfig_1 = __webpack_require__(10);
	var Spinner_1 = __webpack_require__(46);
	var ProfilesModel = (function (_super) {
	    __extends(ProfilesModel, _super);
	    function ProfilesModel() {
	        _super.call(this);
	        this.mSpeakersLoaded = false;
	        this.mVolunteersLoaded = false;
	        this.mPartnersLoaded = false;
	        this.mSpeakers = [];
	        this.mVolunteers = [];
	        this.mPartners = [];
	    }
	    ProfilesModel.prototype.IsSpeakersLoaded = function () { return this.mSpeakersLoaded; };
	    ProfilesModel.prototype.IsVolunteersLoaded = function () { return this.mVolunteersLoaded; };
	    ProfilesModel.prototype.IsPartnersLoaded = function () { return this.mPartnersLoaded; };
	    ProfilesModel.prototype.FetchSpeakers = function () {
	        Spinner_1.default.GetInstance().Show();
	        this.Fetch(EConfig_1.default.BASE_URL + "speaker?per_page=" + EConfig_1.default.PER_PAGE);
	    };
	    ProfilesModel.prototype.FetchVolunteers = function () {
	        var _this = this;
	        Spinner_1.default.GetInstance().Show();
	        var promise = cortex_toolkit_js_net_1.LazyLoader.loadJSON(EConfig_1.default.BASE_URL + "benevole?per_page=" + EConfig_1.default.PER_PAGE);
	        promise.then(function (results) { _this.OnVolunteersURLLoaded(results); });
	    };
	    ProfilesModel.prototype.FetchPartners = function () {
	        var _this = this;
	        Spinner_1.default.GetInstance().Show();
	        var promise = cortex_toolkit_js_net_1.LazyLoader.loadJSON(EConfig_1.default.BASE_URL + "sponsor?per_page=" + EConfig_1.default.PER_PAGE);
	        promise.then(function (results) { _this.OnPartnersURLLoaded(results); });
	    };
	    ProfilesModel.prototype.OnPartnersURLLoaded = function (aJSONData) {
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var profile = new Profile_1.default();
	            profile.FromJSON(json[i]);
	            this.mPartners.push(profile);
	        }
	        this.mPartnersLoaded = true;
	        Spinner_1.default.GetInstance().Hide();
	        this.DispatchEvent(new ProfileEvent_1.default(ProfileEvent_1.default.PARTNERS_LOADED));
	    };
	    ProfilesModel.prototype.OnVolunteersURLLoaded = function (aJSONData) {
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var profile = new Profile_1.default();
	            profile.FromJSON(json[i]);
	            this.mVolunteers.push(profile);
	        }
	        this.mVolunteersLoaded = true;
	        Spinner_1.default.GetInstance().Hide();
	        this.DispatchEvent(new ProfileEvent_1.default(ProfileEvent_1.default.VOLUNTEERS_LOADED));
	    };
	    ProfilesModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var profile = new Profile_1.default();
	            profile.FromJSON(json[i]);
	            this.mSpeakers.push(profile);
	        }
	        this.mSpeakersLoaded = true;
	        Spinner_1.default.GetInstance().Hide();
	        this.DispatchEvent(new ProfileEvent_1.default(ProfileEvent_1.default.SPEAKERS_LOADED));
	    };
	    ProfilesModel.prototype.GetProfiles = function () {
	        var profiles = this.GetSpeakers();
	        profiles = profiles.concat(this.GetVolunteers());
	        profiles = profiles.concat(this.GetPartners());
	        return profiles;
	    };
	    ProfilesModel.prototype.GetVolunteerByID = function (aProfileID) {
	        for (var i = 0, max = this.mVolunteers.length; i < max; i++) {
	            if (this.mVolunteers[i].profileID == aProfileID) {
	                return this.mVolunteers[i];
	            }
	        }
	        return null;
	    };
	    ProfilesModel.prototype.GetVolunteers = function () { return this.mVolunteers.slice(0, this.mVolunteers.length); };
	    ProfilesModel.prototype.GetSpeakerByID = function (aProfileID) {
	        for (var i = 0, max = this.mSpeakers.length; i < max; i++) {
	            if (this.mSpeakers[i].profileID == aProfileID) {
	                return this.mSpeakers[i];
	            }
	        }
	        return null;
	    };
	    ProfilesModel.prototype.GetSpeakers = function () { return this.mSpeakers.slice(0, this.mSpeakers.length); };
	    ProfilesModel.prototype.GetPartnerByID = function (aProfileID) {
	        for (var i = 0, max = this.mPartners.length; i < max; i++) {
	            if (this.mPartners[i].profileID == aProfileID) {
	                return this.mPartners[i];
	            }
	        }
	        return null;
	    };
	    ProfilesModel.prototype.GetPartners = function () { return this.mPartners.slice(0, this.mPartners.length); };
	    ProfilesModel.GetInstance = function () {
	        if (ProfilesModel.mInstance == null) {
	            ProfilesModel.mInstance = new ProfilesModel();
	        }
	        return ProfilesModel.mInstance;
	    };
	    return ProfilesModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ProfilesModel;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var ProfileEvent = (function (_super) {
	    __extends(ProfileEvent, _super);
	    function ProfileEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    ProfileEvent.SPEAKERS_LOADED = "com.cortex.waq.profile.event.ProfileEvent::SPEAKERS_LOADED";
	    ProfileEvent.PARTNERS_LOADED = "com.waq.cortex.profile.event.ProfileEvent::PARTNERS_LOADED";
	    ProfileEvent.VOLUNTEERS_LOADED = "com.waq.cortex.profile.event.ProfileEvent::VOLUNTEERS_LOADED";
	    return ProfileEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ProfileEvent;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractModel_1 = __webpack_require__(42);
	var Conference_1 = __webpack_require__(50);
	var ProfilesModel_1 = __webpack_require__(47);
	var TimeSlotModel_1 = __webpack_require__(51);
	var SubjectTypeModel_1 = __webpack_require__(53);
	var RoomModel_1 = __webpack_require__(55);
	var EConfig_1 = __webpack_require__(10);
	var Spinner_1 = __webpack_require__(46);
	var ConferenceModel = (function (_super) {
	    __extends(ConferenceModel, _super);
	    function ConferenceModel() {
	        _super.call(this);
	        this.mDataLoaded = false;
	        this.mProfilesModel = ProfilesModel_1.default.GetInstance();
	        this.mTimeSlotModel = TimeSlotModel_1.default.GetInstance();
	        this.mSubjectTypeModel = SubjectTypeModel_1.default.GetInstance();
	        this.mRoomModel = RoomModel_1.default.GetInstance();
	        this.mConferences = [];
	    }
	    ConferenceModel.prototype.IsLoaded = function () { return this.mDataLoaded; };
	    ConferenceModel.prototype.FetchConferences = function () {
	        Spinner_1.default.GetInstance().Show();
	        if (!this.mProfilesModel.IsSpeakersLoaded()) {
	            this.mProfilesModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnProfilesLoaded, this);
	            this.mProfilesModel.FetchSpeakers();
	        }
	        else if (!this.mTimeSlotModel.IsLoaded()) {
	            this.mTimeSlotModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnTimeSlotsLoaded, this);
	            this.mTimeSlotModel.FetchTimeSlots();
	        }
	        else if (!this.mSubjectTypeModel.IsLoaded()) {
	            this.mSubjectTypeModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnSubjectTypesLoaded, this);
	            this.mSubjectTypeModel.FetchSubjectTypes();
	        }
	        else if (!this.mRoomModel.IsLoaded()) {
	            this.mRoomModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnRoomLoaded, this);
	            this.mRoomModel.FetchRooms();
	        }
	        else {
	            this.Fetch(EConfig_1.default.BASE_URL + "session?per_page=" + EConfig_1.default.PER_PAGE);
	        }
	    };
	    ConferenceModel.prototype.OnRoomLoaded = function (aEvent) {
	        this.mRoomModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnRoomLoaded, this);
	        this.FetchConferences();
	    };
	    ConferenceModel.prototype.OnSubjectTypesLoaded = function (aEvent) {
	        this.mSubjectTypeModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnSubjectTypesLoaded, this);
	        this.FetchConferences();
	    };
	    ConferenceModel.prototype.OnTimeSlotsLoaded = function (aEvent) {
	        this.mTimeSlotModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnTimeSlotsLoaded, this);
	        this.FetchConferences();
	    };
	    ConferenceModel.prototype.OnProfilesLoaded = function (aEvent) {
	        this.mProfilesModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnProfilesLoaded, this);
	        this.FetchConferences();
	    };
	    ConferenceModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        var totalItems = json.length;
	        for (var i = 0; i < totalItems; i++) {
	            var conference = new Conference_1.default();
	            conference.FromJSON(json[i]);
	            conference.speaker = this.mProfilesModel.GetSpeakerByID(conference.speakerID);
	            conference.timeSlot = this.mTimeSlotModel.GetTimeSlotByID(conference.timeSlotID);
	            conference.subjectType = this.mSubjectTypeModel.GetSubjectTypeByID(conference.subjectTypeID);
	            conference.room = this.mRoomModel.GetRoomByID(conference.roomID);
	            if (conference.room == null) {
	                conference.room = this.mRoomModel.GetRooms()[0];
	            }
	            if (conference.timeSlot == null) {
	                conference.timeSlot = this.mTimeSlotModel.GetTimeSlots()[0];
	            }
	            if (conference.speaker == null && !conference.break) {
	                conference.speaker = this.mProfilesModel.GetSpeakers()[0];
	            }
	            if (conference.subjectType == null) {
	                conference.subjectType = this.mSubjectTypeModel.GetSubjectTypes()[0];
	            }
	            this.mConferences.push(conference);
	        }
	        Spinner_1.default.GetInstance().Hide();
	        this.mDataLoaded = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    ConferenceModel.prototype.GetConferenceByID = function (aConferenceID) {
	        for (var i = 0, max = this.mConferences.length; i < max; i++) {
	            if (this.mConferences[i].conferenceID == aConferenceID) {
	                return this.mConferences[i];
	            }
	        }
	        return null;
	    };
	    ConferenceModel.prototype.GetConferenceBySpeaker = function (aSpeaker) {
	        for (var i = 0, max = this.mConferences.length; i < max; i++) {
	            if (this.mConferences[i].speaker == aSpeaker) {
	                return this.mConferences[i];
	            }
	        }
	        return null;
	    };
	    ConferenceModel.prototype.GetConferencesByDay = function (aDay) {
	        var conferencesByDate = [];
	        for (var i = 0, max = this.mConferences.length; i < max; i++) {
	            if (this.mConferences[i].timeSlot.day == aDay) {
	                conferencesByDate.push(this.mConferences[i]);
	            }
	        }
	        return (conferencesByDate);
	    };
	    ConferenceModel.prototype.GetConferences = function () {
	        return this.mConferences.slice(0, this.mConferences.length);
	    };
	    ConferenceModel.GetInstance = function () {
	        if (ConferenceModel.mInstance == null) {
	            ConferenceModel.mInstance = new ConferenceModel();
	        }
	        return ConferenceModel.mInstance;
	    };
	    return ConferenceModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ConferenceModel;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var Conference = (function (_super) {
	    __extends(Conference, _super);
	    function Conference() {
	        _super.call(this);
	    }
	    Object.defineProperty(Conference.prototype, "conferenceID", {
	        get: function () { return this.mConferenceID; },
	        set: function (aValue) { this.mConferenceID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "title", {
	        get: function () { return this.mTitle; },
	        set: function (aValue) { this.mTitle = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "shortTitle", {
	        get: function () { return this.mShortTitle; },
	        set: function (aValue) { this.mShortTitle = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "description", {
	        get: function () { return this.mDescription; },
	        set: function (aValue) { this.mDescription = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "slug", {
	        get: function () { return this.mSlug; },
	        set: function (aValue) { this.mSlug = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "break", {
	        get: function () { return this.mBreak; },
	        set: function (aValue) { this.mBreak = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "speakerID", {
	        get: function () { return this.mSpeakerID; },
	        set: function (aValue) { this.mSpeakerID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "speaker", {
	        get: function () { return this.mSpeaker; },
	        set: function (aValue) { this.mSpeaker = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "timeSlotID", {
	        get: function () { return this.mTimeSlotID; },
	        set: function (aValue) { this.mTimeSlotID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "timeSlot", {
	        get: function () { return this.mTimeSlot; },
	        set: function (aValue) { this.mTimeSlot = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "subjectTypeID", {
	        get: function () { return this.mSubjectTypeID; },
	        set: function (aValue) { this.mSubjectTypeID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "subjectType", {
	        get: function () { return this.mSubjectType; },
	        set: function (aValue) { this.mSubjectType = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "roomID", {
	        get: function () { return this.mRoomID; },
	        set: function (aValue) { this.mRoomID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "room", {
	        get: function () { return this.mRoom; },
	        set: function (aValue) { this.mRoom = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Conference.prototype.FromJSON = function (aData) {
	        this.mConferenceID = aData.id;
	        var div = document.createElement("div");
	        div.innerHTML = aData.title.rendered;
	        this.mTitle = this.mShortTitle = div.textContent.toUpperCase();
	        if (this.mTitle.length > 90) {
	            this.mShortTitle = this.mTitle.slice(0, 90) + "...";
	        }
	        this.mDescription = !aData.waq_meta.description ? aData.content.rendered : aData.waq_meta.description;
	        this.mSlug = aData.slug;
	        this.mBreak = aData.acf.is_not_session;
	        this.mSpeakerID = aData.waq_meta._conferencer_speakers[0].split("\"")[1];
	        this.mTimeSlotID = aData.waq_meta._conferencer_time_slot[0];
	        this.mSubjectTypeID = aData.waq_meta._conferencer_track[0];
	        this.mRoomID = aData.waq_meta._conferencer_room[0];
	    };
	    return Conference;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Conference;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractModel_1 = __webpack_require__(42);
	var TimeSlot_1 = __webpack_require__(52);
	var EConfig_1 = __webpack_require__(10);
	var TimeSlotModel = (function (_super) {
	    __extends(TimeSlotModel, _super);
	    function TimeSlotModel() {
	        _super.call(this);
	        this.mDataLoaded = false;
	        this.mTimeSlots = [];
	    }
	    TimeSlotModel.prototype.IsLoaded = function () { return this.mDataLoaded; };
	    TimeSlotModel.prototype.FetchTimeSlots = function () {
	        this.Fetch(EConfig_1.default.BASE_URL + "time_slot?per_page=" + EConfig_1.default.PER_PAGE);
	    };
	    TimeSlotModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        var totalItems = json.length;
	        for (var i = 0; i < totalItems; i++) {
	            var timeSlot = new TimeSlot_1.default();
	            timeSlot.FromJSON(json[i]);
	            this.mTimeSlots.push(timeSlot);
	        }
	        this.mDataLoaded = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    TimeSlotModel.prototype.GetTimeSlotByID = function (aTimeSlotID) {
	        for (var i = 0, max = this.mTimeSlots.length; i < max; i++) {
	            if (this.mTimeSlots[i].timeSlotID == aTimeSlotID) {
	                return this.mTimeSlots[i];
	            }
	        }
	        return null;
	    };
	    TimeSlotModel.prototype.GetTimeSlots = function () {
	        return this.mTimeSlots;
	    };
	    TimeSlotModel.GetInstance = function () {
	        if (TimeSlotModel.mInstance == null) {
	            TimeSlotModel.mInstance = new TimeSlotModel();
	        }
	        return TimeSlotModel.mInstance;
	    };
	    return TimeSlotModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TimeSlotModel;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var TimeSlot = (function (_super) {
	    __extends(TimeSlot, _super);
	    function TimeSlot() {
	        _super.call(this);
	    }
	    ;
	    Object.defineProperty(TimeSlot.prototype, "timeSlotID", {
	        get: function () { return this.mTimeslotID; },
	        set: function (aValue) { this.mTimeslotID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TimeSlot.prototype, "begin", {
	        get: function () { return this.mBegin; },
	        set: function (aValue) { this.mBegin = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TimeSlot.prototype, "end", {
	        get: function () { return this.mEnd; },
	        set: function (aValue) { this.mEnd = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TimeSlot.prototype, "day", {
	        get: function () { return this.mDay; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TimeSlot.prototype, "hours", {
	        get: function () { return this.mHours; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TimeSlot.prototype, "minutes", {
	        get: function () { return this.mMinutes; },
	        enumerable: true,
	        configurable: true
	    });
	    TimeSlot.prototype.FromJSON = function (aData) {
	        this.mTimeslotID = aData.id;
	        this.mBegin = new Date(aData.waq_meta._conferencer_starts[0] * 1000);
	        this.mBegin.setUTCHours(this.mBegin.getUTCHours() + 4);
	        this.mEnd = new Date(aData.waq_meta._conferencer_ends[0] * 1000);
	        this.mEnd.setUTCHours(this.mEnd.getUTCHours() + 4);
	        this.mDay = this.mBegin.getDate();
	        var hours = this.mBegin.getHours();
	        var minutes = this.mBegin.getMinutes();
	        this.mHours = (hours < 10) ? "0" + hours.toString() : hours.toString();
	        this.mMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
	    };
	    return TimeSlot;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TimeSlot;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractModel_1 = __webpack_require__(42);
	var SubjectType_1 = __webpack_require__(54);
	var EConfig_1 = __webpack_require__(10);
	var SubjectTypeModel = (function (_super) {
	    __extends(SubjectTypeModel, _super);
	    function SubjectTypeModel() {
	        _super.call(this);
	        this.mDataLoaded = false;
	        this.mSubjectTypes = [];
	    }
	    SubjectTypeModel.prototype.IsLoaded = function () { return this.mDataLoaded; };
	    SubjectTypeModel.prototype.FetchSubjectTypes = function () {
	        this.Fetch(EConfig_1.default.BASE_URL + "track?per_page=" + EConfig_1.default.PER_PAGE);
	    };
	    SubjectTypeModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        var totalItems = json.length;
	        for (var i = 0; i < totalItems; i++) {
	            var subjectType = new SubjectType_1.default();
	            subjectType.FromJSON(json[i]);
	            this.mSubjectTypes.push(subjectType);
	        }
	        this.mDataLoaded = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    SubjectTypeModel.prototype.GetSubjectTypeByID = function (aSubjecTypeID) {
	        for (var i = 0, max = this.mSubjectTypes.length; i < max; i++) {
	            if (this.mSubjectTypes[i].subjectTypeID == aSubjecTypeID) {
	                return this.mSubjectTypes[i];
	            }
	        }
	        return null;
	    };
	    SubjectTypeModel.prototype.GetSubjectTypes = function () {
	        return this.mSubjectTypes;
	    };
	    SubjectTypeModel.GetInstance = function () {
	        if (SubjectTypeModel.mInstance == null) {
	            SubjectTypeModel.mInstance = new SubjectTypeModel();
	        }
	        return SubjectTypeModel.mInstance;
	    };
	    return SubjectTypeModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SubjectTypeModel;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var SubjectType = (function (_super) {
	    __extends(SubjectType, _super);
	    function SubjectType() {
	        _super.call(this);
	    }
	    Object.defineProperty(SubjectType.prototype, "subjectTypeID", {
	        get: function () { return this.mSubjectTypeID; },
	        set: function (aValue) { this.mSubjectTypeID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SubjectType.prototype, "name", {
	        get: function () { return this.mName; },
	        set: function (aValue) { this.mName = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SubjectType.prototype, "subjectSlug", {
	        get: function () { return this.mSubjectSlug; },
	        set: function (aValue) { this.mSubjectSlug = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    SubjectType.prototype.FromJSON = function (aData) {
	        this.mSubjectTypeID = aData.id;
	        this.mSubjectSlug = aData.slug;
	        this.mName = aData.title.rendered;
	    };
	    return SubjectType;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SubjectType;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractModel_1 = __webpack_require__(42);
	var Room_1 = __webpack_require__(56);
	var EConfig_1 = __webpack_require__(10);
	var RoomModel = (function (_super) {
	    __extends(RoomModel, _super);
	    function RoomModel() {
	        _super.call(this);
	        this.mDataLoaded = false;
	        this.mRooms = [];
	    }
	    RoomModel.prototype.IsLoaded = function () { return this.mDataLoaded; };
	    RoomModel.prototype.FetchRooms = function () {
	        this.Fetch(EConfig_1.default.BASE_URL + "room?per_page=" + EConfig_1.default.PER_PAGE);
	    };
	    RoomModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        var totalItems = json.length;
	        for (var i = 0; i < totalItems; i++) {
	            var room = new Room_1.default();
	            room.FromJSON(json[i]);
	            this.mRooms.push(room);
	        }
	        this.mDataLoaded = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    RoomModel.prototype.GetRoomByID = function (aRoomID) {
	        for (var i = 0, max = this.mRooms.length; i < max; i++) {
	            if (this.mRooms[i].roomID == aRoomID) {
	                return this.mRooms[i];
	            }
	        }
	        return null;
	    };
	    RoomModel.prototype.GetRooms = function () {
	        return this.mRooms;
	    };
	    RoomModel.GetInstance = function () {
	        if (RoomModel.mInstance == null) {
	            RoomModel.mInstance = new RoomModel();
	        }
	        return RoomModel.mInstance;
	    };
	    return RoomModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RoomModel;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var Room = (function (_super) {
	    __extends(Room, _super);
	    function Room() {
	        _super.call(this);
	    }
	    Object.defineProperty(Room.prototype, "roomID", {
	        get: function () { return this.mRoomID; },
	        set: function (aValue) { this.mRoomID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Room.prototype, "name", {
	        get: function () { return this.mName; },
	        set: function (aValue) { this.mName = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Room.prototype.FromJSON = function (aData) {
	        this.mRoomID = aData.id;
	        this.mName = aData.title.rendered;
	    };
	    return Room;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Room;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(33);
	var PlaceModel_1 = __webpack_require__(58);
	var ContactController = (function (_super) {
	    __extends(ContactController, _super);
	    function ContactController() {
	        _super.call(this);
	        this.Init();
	    }
	    ContactController.prototype.Init = function () {
	        this.mPlaceModel = PlaceModel_1.default.GetInstance();
	        if (this.mPlaceModel.IsLoaded()) {
	            this.OnJSONLoaded(null);
	        }
	        else {
	            this.mPlaceModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	            this.mPlaceModel.FetchPlaces();
	        }
	    };
	    ContactController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("contact-view");
	        document.getElementById("content-current").removeChild(scheduleHTMLElement);
	        this.mContactView.Destroy();
	        this.mContactView = null;
	    };
	    ContactController.prototype.OnJSONLoaded = function (aEvent) {
	        this.mContactView = new AbstractView_1.default();
	        this.mContactView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mContactView.LoadTemplate("templates/contact/contact.html");
	    };
	    ContactController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("content-loading").innerHTML += this.mContactView.RenderTemplate({});
	        this.mContactView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    return ContactController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ContactController;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractModel_1 = __webpack_require__(42);
	var Place_1 = __webpack_require__(59);
	var Spinner_1 = __webpack_require__(46);
	var EConfig_1 = __webpack_require__(10);
	var PlaceModel = (function (_super) {
	    __extends(PlaceModel, _super);
	    function PlaceModel() {
	        _super.call(this);
	        this.mDataLoaded = false;
	        this.mPlaces = [];
	    }
	    PlaceModel.prototype.IsLoaded = function () { return this.mDataLoaded; };
	    PlaceModel.prototype.FetchPlaces = function () {
	        Spinner_1.default.GetInstance().Show();
	        this.Fetch(EConfig_1.default.BASE_URL + "place?per_page=" + EConfig_1.default.PER_PAGE);
	    };
	    PlaceModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var place = new Place_1.default();
	            place.FromJSON(json[i]);
	            this.mPlaces.push(place);
	        }
	        Spinner_1.default.GetInstance().Hide();
	        this.mDataLoaded = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    PlaceModel.prototype.GetPlaceByID = function (aPlaceID) {
	        for (var i = 0, max = this.mPlaces.length; i < max; i++) {
	            if (this.mPlaces[i].placeID == aPlaceID) {
	                return (this.mPlaces[i]);
	            }
	        }
	        return null;
	    };
	    PlaceModel.prototype.GetPlaceByType = function (aType) {
	        var placeByTypes = [];
	        for (var i = 0, max = this.mPlaces.length; i < max; i++) {
	            if (this.mPlaces[i].type == aType) {
	                placeByTypes.push(this.mPlaces[i]);
	            }
	        }
	        return placeByTypes;
	    };
	    PlaceModel.prototype.GetPlaces = function () {
	        return this.mPlaces.slice(0, this.mPlaces.length);
	    };
	    PlaceModel.GetInstance = function () {
	        if (PlaceModel.mInstance == null) {
	            PlaceModel.mInstance = new PlaceModel();
	        }
	        return PlaceModel.mInstance;
	    };
	    return PlaceModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = PlaceModel;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var Place = (function (_super) {
	    __extends(Place, _super);
	    function Place() {
	        _super.call(this);
	    }
	    Object.defineProperty(Place.prototype, "placeID", {
	        get: function () { return this.mPlaceID; },
	        set: function (aValue) { this.mPlaceID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Place.prototype, "distance", {
	        get: function () { return this.mDistance; },
	        set: function (aValue) { this.mDistance = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Place.prototype, "name", {
	        get: function () { return this.mName; },
	        set: function (aValue) { this.mName = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Place.prototype, "type", {
	        get: function () { return this.mType; },
	        set: function (aValue) { this.mType = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Place.prototype, "price", {
	        get: function () { return this.mPrice; },
	        set: function (aPrice) { this.mPrice = aPrice; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Place.prototype, "hours", {
	        get: function () { return this.mHours; },
	        set: function (aHours) { this.mHours = aHours; },
	        enumerable: true,
	        configurable: true
	    });
	    Place.prototype.FromJSON = function (aData) {
	        this.mPlaceID = aData.id;
	        var div = document.createElement("div");
	        div.innerHTML = aData.title.rendered;
	        this.mName = div.textContent;
	        this.mType = aData.acf.type;
	        this.mDistance = aData.distance;
	        this.mPrice = aData.price;
	        this.mHours = aData.hours;
	    };
	    return Place;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Place;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractView_1 = __webpack_require__(33);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var MenuEvent_1 = __webpack_require__(61);
	var MenuController_1 = __webpack_require__(62);
	var HeaderController = (function (_super) {
	    __extends(HeaderController, _super);
	    function HeaderController() {
	        _super.call(this);
	        this.Init();
	    }
	    HeaderController.prototype.Init = function () {
	        this.mHeaderView = new AbstractView_1.default();
	        this.mHeaderView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mHeaderView.LoadTemplate("templates/header/header.html");
	        this.mMenuController = new MenuController_1.default();
	        this.mMenuController.AddEventListener(MenuEvent_1.default.CLOSE_MENU, this.OnMenuClose, this);
	    };
	    HeaderController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("header-view").innerHTML += this.mHeaderView.RenderTemplate({});
	        this.mHeaderView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mHeaderView.AddClickControl(document.getElementById("header-button-menu"));
	        this.mHeaderView.AddClickControl(document.getElementById("header-button-tickets"));
	        this.mHeaderView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	    };
	    HeaderController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id == "header-button-menu") {
	            this.OnMenuClicked();
	        }
	        else if (element.id == "header-button-tickets") {
	            this.OnTicketsClicked();
	        }
	    };
	    HeaderController.prototype.OnMenuClicked = function () {
	        this.HideMenuButton();
	        this.mMenuController.Show();
	    };
	    HeaderController.prototype.OnTicketsClicked = function () {
	        cortex_toolkit_js_router_1.Router.GetInstance().Navigate("billets");
	    };
	    HeaderController.prototype.OnMenuClose = function () {
	        if (document.getElementById("header-view") == null) {
	            return;
	        }
	        this.ShowMenuButton();
	        this.mMenuController.Hide();
	    };
	    HeaderController.prototype.HideMenuButton = function () {
	        var menu = document.getElementById("header-view");
	        menu.className = "hidden";
	    };
	    HeaderController.prototype.ShowMenuButton = function () {
	        var menu = document.getElementById("header-view");
	        menu.className = "";
	    };
	    return HeaderController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = HeaderController;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(5);
	var MenuEvent = (function (_super) {
	    __extends(MenuEvent, _super);
	    function MenuEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    MenuEvent.SHOW_MENU = "com.cortex.waq.menu.event.MenuEvent::SHOW_MENU";
	    MenuEvent.CLOSE_MENU = "com.cortex.waq.menu.event.MenuEvent::CLOSE_MENU";
	    MenuEvent.ITEMS_READY = "com.cortex.waq.menu.event.MenuEvent::ITEMS_READY";
	    return MenuEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuEvent;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentEvent_1 = __webpack_require__(29);
	var ComponentBinding_1 = __webpack_require__(31);
	var ListComponent_1 = __webpack_require__(30);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MVCEvent_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(33);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var MenuEvent_1 = __webpack_require__(61);
	var MenuItemModel_1 = __webpack_require__(63);
	var MenuController = (function (_super) {
	    __extends(MenuController, _super);
	    function MenuController() {
	        _super.call(this);
	        this.Init();
	    }
	    MenuController.prototype.Init = function () {
	        this.mMenuItemsReady = false;
	        this.mWaitingOnItems = false;
	        MenuItemModel_1.default.GetInstance().AddEventListener(MenuEvent_1.default.ITEMS_READY, this.OnJSONParsed, this);
	        this.mTotalItems = 0;
	    };
	    MenuController.prototype.Destroy = function () {
	        var menuHTMLElement = document.getElementById("menu-view");
	        document.getElementById("overlay").removeChild(menuHTMLElement);
	        this.mMenuView.RemoveEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mListComponent.Destroy();
	        this.mListComponent = null;
	        this.mMenuView.Destroy();
	        this.mMenuView = null;
	        _super.prototype.Destroy.call(this);
	    };
	    MenuController.prototype.Hide = function () {
	        var menuHTMLElement = document.getElementById("menu-view");
	        if (menuHTMLElement != null) {
	            menuHTMLElement.className = "hidden";
	        }
	    };
	    MenuController.prototype.Show = function () {
	        if (!this.mMenuItemsReady) {
	            this.mWaitingOnItems = true;
	            return;
	        }
	        var menuHTMLElement = document.getElementById("menu-view");
	        if (menuHTMLElement != null) {
	            menuHTMLElement.className = "";
	            menuHTMLElement.scrollTop = 0;
	        }
	    };
	    MenuController.prototype.OnJSONParsed = function () {
	        MenuItemModel_1.default.GetInstance().RemoveEventListener(MenuEvent_1.default.ITEMS_READY, this.OnJSONParsed, this);
	        this.mMenuView = new AbstractView_1.default();
	        this.mMenuView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mMenuView.LoadTemplate("templates/menu/menu.html");
	        this.mMenuItemsReady = true;
	        if (this.mWaitingOnItems) {
	            this.mWaitingOnItems = false;
	            this.Show();
	        }
	    };
	    MenuController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("overlay").innerHTML += this.mMenuView.RenderTemplate({});
	        this.mMenuView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mMenuView.AddClickControl(document.getElementById("menu-close"));
	        this.mMenuView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mListComponent = new ListComponent_1.default();
	        this.mListComponent.Init("menu-itemContainer");
	        this.GenerateMenuItems();
	        this.Hide();
	    };
	    MenuController.prototype.GenerateMenuItems = function () {
	        var menuItems = MenuItemModel_1.default.GetInstance().GetMenuItems();
	        menuItems.sort(function (a, b) {
	            if (a.order < b.order) {
	                return -1;
	            }
	            ;
	            if (a.order > b.order) {
	                return 1;
	            }
	            ;
	            return 0;
	        });
	        this.mTotalItems = menuItems.length;
	        for (var i = 0; i < this.mTotalItems; i++) {
	            this.mListComponent.AddComponent(new ComponentBinding_1.default(new AbstractView_1.default(), menuItems[i]));
	        }
	        this.mListComponent.AddEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.AllItemsReady, this);
	        this.mListComponent.LoadWithTemplate("templates/menu/menuItem.html");
	    };
	    MenuController.prototype.AllItemsReady = function () {
	        this.mListComponent.RemoveEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.AllItemsReady, this);
	        for (var i = 0, max = this.mTotalItems; i < max; i++) {
	            this.mMenuView.AddClickControl(document.getElementById("menu-menuItem" + i.toString()));
	        }
	    };
	    MenuController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id == "menu-close") {
	            this.OnMenuClose();
	        }
	        else if (element.id.indexOf("menu-menuItem") >= 0) {
	            this.OnMenuItemClicked(element.id);
	        }
	    };
	    MenuController.prototype.OnMenuClose = function () {
	        this.DispatchEvent(new MenuEvent_1.default(MenuEvent_1.default.CLOSE_MENU));
	    };
	    MenuController.prototype.OnMenuItemClicked = function (aElementId) {
	        var menuItemId = aElementId.split("menu-menuItem")[1];
	        var menuItem = this.mListComponent.GetDataByID(menuItemId);
	        cortex_toolkit_js_router_1.Router.GetInstance().Navigate(menuItem.action);
	        this.DispatchEvent(new MenuEvent_1.default(MenuEvent_1.default.CLOSE_MENU));
	    };
	    return MenuController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuController;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AbstractModel_1 = __webpack_require__(42);
	var MenuItem_1 = __webpack_require__(64);
	var MenuEvent_1 = __webpack_require__(61);
	var MenuItemModel = (function (_super) {
	    __extends(MenuItemModel, _super);
	    function MenuItemModel() {
	        _super.call(this);
	        this.mMenuItems = [];
	        this.CreateMenuItems();
	    }
	    MenuItemModel.GetInstance = function () {
	        if (MenuItemModel.mInstance == null) {
	            MenuItemModel.mInstance = new MenuItemModel();
	        }
	        return MenuItemModel.mInstance;
	    };
	    MenuItemModel.prototype.CreateMenuItems = function () {
	        this.Fetch("json/waq/menu_items.json");
	    };
	    MenuItemModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var menuItem = new MenuItem_1.default();
	            menuItem.FromJSON(json[i]);
	            this.mMenuItems.push(menuItem);
	        }
	        this.DispatchEvent(new MenuEvent_1.default(MenuEvent_1.default.ITEMS_READY));
	    };
	    MenuItemModel.prototype.GetMenuItems = function () {
	        return this.mMenuItems;
	    };
	    return MenuItemModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuItemModel;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var MenuItem = (function (_super) {
	    __extends(MenuItem, _super);
	    function MenuItem() {
	        _super.call(this);
	    }
	    Object.defineProperty(MenuItem.prototype, "name", {
	        get: function () { return this.mName; },
	        set: function (aName) { this.mName = aName; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MenuItem.prototype, "order", {
	        get: function () { return this.mOrder; },
	        set: function (aOrder) { this.mOrder = aOrder; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MenuItem.prototype, "action", {
	        get: function () { return this.mAction; },
	        set: function (aAction) { this.mAction = aAction; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MenuItem.prototype, "controller", {
	        get: function () { return this.mController; },
	        set: function (aController) { this.mController = aController; },
	        enumerable: true,
	        configurable: true
	    });
	    MenuItem.prototype.FromJSON = function (aData) {
	        this.mName = aData.name;
	        this.mOrder = aData.order;
	        this.mAction = aData.action;
	        this.mController = aData.controller;
	    };
	    return MenuItem;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuItem;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractView_1 = __webpack_require__(33);
	var BlogModel_1 = __webpack_require__(41);
	var HomeController = (function (_super) {
	    __extends(HomeController, _super);
	    function HomeController() {
	        _super.call(this);
	        this.mBlogPostMaximumLength = 325;
	        this.Init();
	    }
	    HomeController.prototype.Init = function () {
	        this.mHomeView = new AbstractView_1.default();
	        this.mHomeView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mHomeView.LoadTemplate("templates/home/home.html");
	    };
	    HomeController.prototype.Destroy = function () {
	        var homeHTMLElement = document.getElementById("home-view");
	        document.getElementById("content-current").removeChild(homeHTMLElement);
	        this.mHomeView.Destroy();
	        this.mHomeView = null;
	    };
	    HomeController.prototype.OnTemplateLoaded = function (aEvent) {
	        this.mHomeView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mBlogModel = BlogModel_1.default.GetInstance();
	        var blogSpots = this.mBlogModel.GetBlogPosts();
	        if (blogSpots.length <= 0) {
	            this.mBlogModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnBlogLoaded, this);
	            this.mBlogModel.FetchBlogPosts();
	        }
	        else {
	            this.OnBlogLoaded(null);
	        }
	    };
	    HomeController.prototype.OnBlogLoaded = function (aEvent) {
	        this.mBlogModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnBlogLoaded, this);
	        var blogSpots = this.mBlogModel.GetBlogPosts();
	        this.mLatestBlog = blogSpots[blogSpots.length - 1];
	        document.getElementById("content-loading").innerHTML += this.mHomeView.RenderTemplate(this.mLatestBlog);
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	        this.mHomeView.AddClickControl(document.getElementById("home-video"));
	        this.mHomeView.AddClickControl(document.getElementById("home-title-schedule"));
	        this.mHomeView.AddClickControl(document.getElementById("home-blog-read"));
	        this.mHomeView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        if (this.mLatestBlog.text.length > this.mBlogPostMaximumLength) {
	            this.mLatestBlog.text = this.mLatestBlog.text.substring(0, this.mBlogPostMaximumLength) + " ...";
	        }
	        document.getElementById("home-blog-text").innerHTML += this.mLatestBlog.text;
	        this.AddCloudsToElement("home-cloudContainer-1", 12);
	        this.AddCloudsToElement("home-cloudContainer-2", 12);
	        this.AddCloudsToElement("home-cloudContainer-3", 12);
	        this.AddCloudsToElement("home-cloudContainer-4", 12);
	        if (window["twttr"] != null && window["twttr"].widgets != null) {
	            window["twttr"].widgets.load();
	        }
	    };
	    HomeController.prototype.AddCloudsToElement = function (aElementId, aCloudCount) {
	        var element = document.getElementById(aElementId);
	        for (var i = 0; i < aCloudCount; i++) {
	            element.innerHTML += "<div class='cloud'></div>";
	        }
	    };
	    HomeController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id == "home-video") {
	            this.OnVideoClicked(element);
	        }
	        else if (element.id == "home-title-schedule") {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate("horaire");
	        }
	        else if (element.id == "home-blog-read") {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(this.mLatestBlog.slug);
	        }
	    };
	    HomeController.prototype.OnVideoClicked = function (element) {
	        element.className = "home-split";
	        element.innerHTML = "<iframe width='100%' height='100%' src='https://www.youtube.com/embed/p8-Sv0GKG-U?autoplay=1&rel=0'" +
	            "frameborder='0' allowfullscreen></iframe>";
	        this.mHomeView.RemoveClickControl(element);
	    };
	    return HomeController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = HomeController;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractView_1 = __webpack_require__(33);
	var ConferenceModel_1 = __webpack_require__(49);
	var ProfileEvent_1 = __webpack_require__(48);
	var ProfilesController_1 = __webpack_require__(67);
	var CompanyModel_1 = __webpack_require__(69);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var SpeakerController = (function (_super) {
	    __extends(SpeakerController, _super);
	    function SpeakerController() {
	        _super.call(this);
	    }
	    SpeakerController.prototype.Init = function () {
	        _super.prototype.Init.call(this);
	        this.mConferenceModel = ConferenceModel_1.default.GetInstance();
	        this.mCompanyModel = CompanyModel_1.default.GetInstance();
	        this.LoadSpeakers();
	    };
	    SpeakerController.prototype.LoadSpeakers = function () {
	        this.mTitle = "Découvrez les conférenciers de l'édition 2016.";
	        this.mQuote = "\"La connaissance est le début de l'action : l'action, l'accomplissement de la connaissance.\"";
	        this.mQuoteAuthor = "-Wang Young Ming";
	        this.mBackButtonText = "Découvrez nos autres confériencers";
	        if (this.mProfilesModel.IsSpeakersLoaded()) {
	            this.OnDataReady(null);
	        }
	        else {
	            this.mProfilesModel.AddEventListener(ProfileEvent_1.default.SPEAKERS_LOADED, this.OnDataReady, this);
	            this.mProfilesModel.FetchSpeakers();
	        }
	    };
	    SpeakerController.prototype.OnDataReady = function (aEvent) {
	        this.mProfilesModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnDataReady, this);
	        this.mProfiles = this.mProfilesModel.GetSpeakers();
	        if (this.mCompanyModel.IsLoaded()) {
	            this.OnCompaniesLoaded(null);
	        }
	        else {
	            this.mCompanyModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnCompaniesLoaded, this);
	            this.mCompanyModel.FetchCompanies();
	        }
	    };
	    SpeakerController.prototype.OnCompaniesLoaded = function (aEvent) {
	        this.mCompanyModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnCompaniesLoaded, this);
	        this.mProfilesView = new AbstractView_1.default();
	        this.mProfilesView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, _super.prototype.OnTemplateLoaded, this);
	        this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	    };
	    SpeakerController.prototype.OnScreenClicked = function (aEvent) {
	        _super.prototype.OnScreenClicked.call(this, aEvent);
	        var element = aEvent.currentTarget;
	        if (element.id === this.mLink.id) {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(this.mSpeakerConference.slug);
	        }
	    };
	    SpeakerController.prototype.SetProfileDetails = function (aProfile) {
	        aProfile.subtitle = this.mCompanyModel.GetCompanyByID(aProfile.companyID).title;
	        _super.prototype.SetProfileDetails.call(this, aProfile);
	        this.mSpeakerConference = this.mConferenceModel.GetConferenceBySpeaker(aProfile);
	        this.mLink.innerHTML = "<br>" + this.mSpeakerConference.title + "<br>" +
	            this.mSpeakerConference.timeSlot.day + " Mars " +
	            this.mSpeakerConference.timeSlot.hours + ":" +
	            this.mSpeakerConference.timeSlot.minutes + ", Salle " +
	            this.mSpeakerConference.room.name;
	    };
	    return SpeakerController;
	})(ProfilesController_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SpeakerController;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentEvent_1 = __webpack_require__(29);
	var ComponentBinding_1 = __webpack_require__(31);
	var ListComponent_1 = __webpack_require__(30);
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractView_1 = __webpack_require__(33);
	var PageControllerHelper_1 = __webpack_require__(68);
	var ProfilesModel_1 = __webpack_require__(47);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var ProfilesController = (function (_super) {
	    __extends(ProfilesController, _super);
	    function ProfilesController() {
	        _super.call(this);
	        this.Init();
	    }
	    ProfilesController.prototype.GetThis = function () {
	        return this;
	    };
	    ProfilesController.prototype.Init = function () {
	        this.mProfilesControllerId = PageControllerHelper_1.default.GetUniqueNumber();
	        this.mTilePrefix = "profiles-tile-" + this.mProfilesControllerId + "-";
	        this.mProfilesModel = ProfilesModel_1.default.GetInstance();
	    };
	    ProfilesController.prototype.Destroy = function () {
	        document.getElementById("content-current").removeChild(this.mPageView);
	        this.mProfilesView.RemoveEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mListComponent.Destroy();
	        this.mListComponent = null;
	        this.mProfilesView.Destroy();
	        this.mProfilesView = null;
	        this.mReady = false;
	    };
	    ProfilesController.prototype.IsReady = function () { return this.mReady; };
	    ProfilesController.prototype.OnTemplateLoaded = function (aEvent) {
	        this.mProfilesView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        document.getElementById("content-loading").innerHTML += this.mProfilesView.RenderTemplate({});
	        this.FindElements();
	        this.mNoSelectionView.innerHTML = "<h1>" + this.mTitle + "</h1>";
	        this.mBackButton.innerHTML = "<p>" + this.mBackButtonText + "</p>";
	        this.mProfilesView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mProfilesView.AddClickControl(this.mBackButton);
	        this.mProfilesView.AddClickControl(this.mLink);
	        this.mListComponent = new ListComponent_1.default();
	        this.mListComponent.Init(this.mGridView.id);
	        this.CreateProfileTiles(this.mProfiles);
	        this.mReady = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    ProfilesController.prototype.FindElements = function () {
	        this.mPageView = PageControllerHelper_1.default.RenameAndReturnElement("profiles-view");
	        this.mNoSelectionView = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selection-none");
	        this.mSelectionView = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selection");
	        this.mGridView = PageControllerHelper_1.default.RenameAndReturnElement("profiles-grid");
	        this.mFullName = PageControllerHelper_1.default.RenameAndReturnElement("profiles-details-name");
	        this.mSubtitle = PageControllerHelper_1.default.RenameAndReturnElement("profiles-details-title");
	        this.mPhoto = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selected-photo");
	        this.mBio = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selected-bio");
	        this.mContact = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selected-contact");
	        this.mSocialName = PageControllerHelper_1.default.RenameAndReturnElement("profiles-details-socialName");
	        this.mLink = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selected-link");
	        this.mScrollView = document.getElementById("profiles-selection-show");
	        this.mBackButton = PageControllerHelper_1.default.RenameAndReturnElement("profiles-selected-return");
	    };
	    ProfilesController.prototype.CreateProfileTiles = function (aProfiles) {
	        this.mTotalProfiles = aProfiles.length;
	        for (var i = 0; i < this.mTotalProfiles; i++) {
	            var componentBinding;
	            if (i == ProfilesController.QUOTE_INDEX_IN_GRID) {
	                componentBinding = new ComponentBinding_1.default(new AbstractView_1.default(), {});
	                componentBinding.Template = "templates/profiles/profileQuote.html";
	                this.mListComponent.AddComponent(componentBinding);
	            }
	            var profile = aProfiles[i];
	            profile.parentId = this.mProfilesControllerId;
	            componentBinding = new ComponentBinding_1.default(new AbstractView_1.default(), profile);
	            componentBinding.Template = "templates/profiles/profileTile.html";
	            this.mListComponent.AddComponent(componentBinding);
	        }
	        this.mListComponent.AddEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.OnAllItemsReady, this);
	        this.mListComponent.LoadWithTemplate();
	    };
	    ProfilesController.prototype.OnAllItemsReady = function (aEvent) {
	        this.mListComponent.RemoveEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.OnAllItemsReady, this);
	        PageControllerHelper_1.default.RenameAndReturnElement("profiles-quoteText").innerHTML = this.mQuote;
	        PageControllerHelper_1.default.RenameAndReturnElement("profiles-quoteAuthor").innerHTML = this.mQuoteAuthor;
	        for (var i = 0; i < this.mTotalProfiles + 1; i++) {
	            var tileElement = document.getElementById(this.mTilePrefix + i.toString());
	            if (tileElement == null) {
	                continue;
	            }
	            this.mProfilesView.AddClickControl(tileElement);
	        }
	    };
	    ProfilesController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id === this.mBackButton.id) {
	            this.OnReturnClicked();
	        }
	        if (element.id === this.mLink.id) {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(this.mLink.textContent);
	        }
	        else if (element.id.indexOf(this.mTilePrefix) >= 0) {
	            var tileId = element.id.split(this.mTilePrefix)[1];
	            var profile = this.mListComponent.GetDataByID(tileId);
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(profile.slug);
	        }
	    };
	    ProfilesController.prototype.OnReturnClicked = function () {
	        this.mSelectionView.className = "profiles-selection profiles-split profiles-hidden";
	        this.DeselectTile();
	    };
	    ProfilesController.prototype.ShowProfile = function (aProfile) {
	        this.SetProfileDetails(aProfile);
	        document.getElementById("profiles-selected-details").scrollTop = 0;
	        this.HideNoSelectionView();
	        this.ShowSelectionView();
	        this.ScrollDetailsView();
	    };
	    ProfilesController.prototype.DeselectTile = function () {
	        if (this.mSelectedTile != null) {
	            this.mSelectedTile.className = "profiles-tile";
	            this.mSelectedTile = null;
	        }
	    };
	    ProfilesController.prototype.SetProfileDetails = function (aProfile) {
	        this.mFullName.innerHTML = aProfile.firstName + " " + aProfile.lastName;
	        if (aProfile.subtitle !== "") {
	            this.mFullName.innerHTML += ", ";
	            this.mSubtitle.innerHTML = aProfile.subtitle;
	        }
	        this.mPhoto.style.backgroundImage = "url(" + aProfile.photo + ")";
	        this.mBio.innerHTML = aProfile.description;
	        var hasSocialMedia = false;
	        hasSocialMedia = this.DisplaySocialLink("profiles-social-twitter", aProfile.twitter) || hasSocialMedia;
	        hasSocialMedia = this.DisplaySocialLink("profiles-social-facebook", aProfile.facebook) || hasSocialMedia;
	        hasSocialMedia = this.DisplaySocialLink("profiles-social-linkedin", aProfile.linkedIn) || hasSocialMedia;
	        if (hasSocialMedia) {
	            this.mContact.style.height = "initial";
	            this.mContact.style.opacity = "1";
	            this.mSocialName.innerHTML = aProfile.firstName + " " + aProfile.lastName;
	        }
	        else {
	            this.mContact.style.height = "0px";
	            this.mContact.style.opacity = "0";
	        }
	    };
	    ProfilesController.prototype.DisplaySocialLink = function (aElementId, aUrl) {
	        var element = document.getElementById(aElementId);
	        if (aUrl === "" || aUrl == null) {
	            element.className = "hidden";
	            return false;
	        }
	        element.className = "profiles-selected-social";
	        element.href = aUrl;
	        return true;
	    };
	    ProfilesController.prototype.HideNoSelectionView = function () {
	        this.mNoSelectionView.style.display = "none";
	    };
	    ProfilesController.prototype.ShowSelectionView = function () {
	        this.mSelectionView.className = "profiles-selection profiles-split profiles-shown";
	    };
	    ProfilesController.prototype.ScrollDetailsView = function () {
	        this.mScrollView.scrollTop = 0;
	    };
	    ProfilesController.QUOTE_INDEX_IN_GRID = 8;
	    return ProfilesController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ProfilesController;


/***/ },
/* 68 */
/***/ function(module, exports) {

	var PageControllerHelper = (function () {
	    function PageControllerHelper() {
	    }
	    PageControllerHelper.GetUniqueNumber = function () {
	        return ++PageControllerHelper.mUniqueCount;
	    };
	    PageControllerHelper.RenameAndReturnElement = function (aElementId) {
	        var element = document.getElementById(aElementId);
	        var newElementId = aElementId + PageControllerHelper.GetUniqueNumber();
	        element.id = newElementId;
	        return element;
	    };
	    PageControllerHelper.mUniqueCount = 0;
	    return PageControllerHelper;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = PageControllerHelper;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AbstractModel_1 = __webpack_require__(42);
	var MVCEvent_1 = __webpack_require__(6);
	var Company_1 = __webpack_require__(70);
	var EConfig_1 = __webpack_require__(10);
	var Spinner_1 = __webpack_require__(46);
	var CompanyModel = (function (_super) {
	    __extends(CompanyModel, _super);
	    function CompanyModel() {
	        _super.call(this);
	        this.mLoaded = false;
	        this.mCompanies = [];
	    }
	    CompanyModel.prototype.IsLoaded = function () { return this.mLoaded; };
	    CompanyModel.prototype.FetchCompanies = function () {
	        Spinner_1.default.GetInstance().Show();
	        this.Fetch(EConfig_1.default.BASE_URL + "company?per_page=" + EConfig_1.default.PER_PAGE);
	    };
	    CompanyModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        for (var i = 0, iMax = json.length; i < iMax; i++) {
	            var company = new Company_1.default();
	            company.FromJSON(json[i]);
	            this.mCompanies.push(company);
	        }
	        this.mLoaded = true;
	        Spinner_1.default.GetInstance().Hide();
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    CompanyModel.prototype.GetCompanie = function () {
	        return this.mCompanies.slice(0, this.mCompanies.length);
	    };
	    CompanyModel.prototype.GetCompanyByID = function (aCompanyID) {
	        for (var i = 0, max = this.mCompanies.length; i < max; i++) {
	            if (this.mCompanies[i].companyID == aCompanyID) {
	                return this.mCompanies[i];
	            }
	        }
	        return null;
	    };
	    CompanyModel.GetInstance = function () {
	        if (CompanyModel.mInstance == null) {
	            CompanyModel.mInstance = new CompanyModel();
	        }
	        return CompanyModel.mInstance;
	    };
	    return CompanyModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CompanyModel;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(44);
	var Company = (function (_super) {
	    __extends(Company, _super);
	    function Company() {
	        _super.call(this);
	    }
	    Object.defineProperty(Company.prototype, "companyID", {
	        get: function () { return this.mCompanyID; },
	        set: function (aValue) { this.mCompanyID = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Company.prototype, "title", {
	        get: function () { return this.mTitle; },
	        set: function (aValue) { this.mTitle = aValue; },
	        enumerable: true,
	        configurable: true
	    });
	    Company.prototype.FromJSON = function (aData) {
	        this.mCompanyID = aData.id;
	        this.mTitle = aData.title.rendered;
	    };
	    return Company;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Company;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractView_1 = __webpack_require__(33);
	var ProfileEvent_1 = __webpack_require__(48);
	var ProfilesController_1 = __webpack_require__(67);
	var PartnerController = (function (_super) {
	    __extends(PartnerController, _super);
	    function PartnerController() {
	        _super.call(this);
	    }
	    PartnerController.prototype.Init = function () {
	        _super.prototype.Init.call(this);
	        this.LoadPartners();
	    };
	    PartnerController.prototype.LoadPartners = function () {
	        this.mTitle = "Découvrez nos précieux partenaires qui contribuent au succès de l'évènement.";
	        this.mQuote = "\"La seule voie qui offre quelque espoir d'un avenir meilleur pour toute l'humanité" +
	            " est celle de la coopération et du partenariat.\"";
	        this.mQuoteAuthor = "-Kofi Annan";
	        this.mBackButtonText = "Découvrez nos autres partenaires";
	        if (this.mProfilesModel.IsPartnersLoaded()) {
	            this.OnDataReady(null);
	        }
	        else {
	            this.mProfilesModel.AddEventListener(ProfileEvent_1.default.PARTNERS_LOADED, this.OnDataReady, this);
	            this.mProfilesModel.FetchPartners();
	        }
	    };
	    PartnerController.prototype.OnDataReady = function (aEvent) {
	        this.mProfilesModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnDataReady, this);
	        this.mProfiles = this.mProfilesModel.GetPartners();
	        this.mProfiles.sort(function (a, b) {
	            if (a.order > b.order) {
	                return 1;
	            }
	            else if (a.order < b.order) {
	                return -1;
	            }
	            else {
	                return 0;
	            }
	        });
	        this.mProfilesView = new AbstractView_1.default();
	        this.mProfilesView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, _super.prototype.OnTemplateLoaded, this);
	        this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	    };
	    return PartnerController;
	})(ProfilesController_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = PartnerController;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var AbstractView_1 = __webpack_require__(33);
	var ProfileEvent_1 = __webpack_require__(48);
	var ProfilesController_1 = __webpack_require__(67);
	var VolunteerController = (function (_super) {
	    __extends(VolunteerController, _super);
	    function VolunteerController() {
	        _super.call(this);
	    }
	    VolunteerController.prototype.Init = function () {
	        _super.prototype.Init.call(this);
	        this.LoadVolunteers();
	    };
	    VolunteerController.prototype.LoadVolunteers = function () {
	        this.mTitle = "Découvrez qui sont les bénévoles qui font du WAQ une vraie réussite.";
	        this.mQuote = "\"Le don de soi est ce qu’on peut offrir de plus grand.\"";
	        this.mQuoteAuthor = "-Ralph Waldo Emerson";
	        this.mBackButtonText = "Découvrez nos autres bénévoles";
	        if (this.mProfilesModel.IsVolunteersLoaded()) {
	            this.OnDataReady(null);
	        }
	        else {
	            this.mProfilesModel.AddEventListener(ProfileEvent_1.default.VOLUNTEERS_LOADED, this.OnDataReady, this);
	            this.mProfilesModel.FetchVolunteers();
	        }
	    };
	    VolunteerController.prototype.OnDataReady = function (aEvent) {
	        this.mProfilesModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnDataReady, this);
	        this.mProfiles = this.mProfilesModel.GetVolunteers();
	        this.mProfilesView = new AbstractView_1.default();
	        this.mProfilesView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, _super.prototype.OnTemplateLoaded, this);
	        this.mProfilesView.LoadTemplate("templates/profiles/profiles.html");
	    };
	    return VolunteerController;
	})(ProfilesController_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = VolunteerController;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ListComponent_1 = __webpack_require__(30);
	var ComponentEvent_1 = __webpack_require__(29);
	var ComponentBinding_1 = __webpack_require__(31);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var MVCEvent_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(33);
	var ConferenceModel_1 = __webpack_require__(49);
	var SubjectTypeModel_1 = __webpack_require__(53);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var ScheduleController = (function (_super) {
	    __extends(ScheduleController, _super);
	    function ScheduleController() {
	        _super.call(this);
	        this.Init();
	    }
	    ScheduleController.prototype.Init = function () {
	        this.mSubjectTypeModel = SubjectTypeModel_1.default.GetInstance();
	        this.mConferenceModel = ConferenceModel_1.default.GetInstance();
	        if (this.mConferenceModel.IsLoaded()) {
	            this.OnJSONLoaded(null);
	        }
	        else {
	            this.mConferenceModel.AddEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	            this.mConferenceModel.FetchConferences();
	        }
	    };
	    ScheduleController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("schedule-view");
	        if (scheduleHTMLElement) {
	            document.getElementById("content-current").removeChild(scheduleHTMLElement);
	        }
	        if (this.mListComponent) {
	            this.mListComponent.RemoveEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.OnConferenceTemplateLoaded, this);
	            this.mListComponent.Destroy();
	        }
	        this.mListComponent = null;
	        if (this.mScheduleView) {
	            this.mScheduleView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	            this.mScheduleView.RemoveEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	            this.mScheduleView.Destroy();
	        }
	        this.mScheduleView = null;
	        if (this.mDayFilters) {
	            this.mDayFilters.length = 0;
	        }
	        this.mDayFilters = null;
	        if (this.mTypeFilters) {
	            this.mTypeFilters.length = 0;
	        }
	        this.mTypeFilters = null;
	        if (this.mEventDays) {
	            this.mEventDays.length = 0;
	        }
	        this.mEventDays = null;
	        if (this.mConferenceModel) {
	            this.mConferenceModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	        }
	        this.mConferenceModel = null;
	        this.mSubjectTypeModel = null;
	        this.mReady = false;
	    };
	    ScheduleController.prototype.IsReady = function () { return this.mReady; };
	    ScheduleController.prototype.OnJSONLoaded = function (aEvent) {
	        this.mConferenceModel.RemoveEventListener(MVCEvent_1.default.JSON_LOADED, this.OnJSONLoaded, this);
	        this.mDayFilters = [];
	        this.mTypeFilters = [];
	        this.mEventDays = [
	            {
	                day: "Mercredi",
	                letter: "M",
	                month: "Avril",
	                date: "6"
	            },
	            {
	                day: "Jeudi",
	                letter: "J",
	                month: "Avril",
	                date: "7"
	            },
	            {
	                day: "Vendredi",
	                letter: "V",
	                month: "Avril",
	                date: "8"
	            }
	        ];
	        this.mScheduleView = new AbstractView_1.default();
	        this.mScheduleView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
	    };
	    ScheduleController.prototype.OnTemplateLoaded = function (aEvent) {
	        this.mScheduleView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        var subjectTypes = this.mSubjectTypeModel.GetSubjectTypes();
	        document.getElementById("content-loading").innerHTML += this.mScheduleView.RenderTemplate({
	            subjectTypes: subjectTypes,
	            dates: this.mEventDays
	        });
	        this.mScheduleView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        var eventDaysLength = this.mEventDays.length;
	        for (var i = 0; i < eventDaysLength; i++) {
	            this.mScheduleView.AddClickControl(document.getElementById("schedule-btn-" + this.mEventDays[i].date));
	        }
	        var subjectTypesLength = subjectTypes.length;
	        for (i = 0; i < subjectTypesLength; i++) {
	            this.mScheduleView.AddClickControl(document.getElementById("tag-" + subjectTypes[i].subjectSlug));
	        }
	        this.mScheduleView.AddClickControl(document.getElementById("schedule-option"));
	        this.mListComponent = new ListComponent_1.default();
	        this.mListComponent.Init("schedule-content");
	        this.GenerateConferences();
	    };
	    ScheduleController.prototype.SortConferenceByTime = function (aDay) {
	        var conferences = this.mConferenceModel.GetConferencesByDay(aDay);
	        conferences.sort(function (a, b) {
	            if (a.timeSlot.hours > b.timeSlot.hours) {
	                return 1;
	            }
	            else if (a.timeSlot.hours == b.timeSlot.hours) {
	                if (a.timeSlot.minutes > b.timeSlot.minutes) {
	                    return 1;
	                }
	                else if (a.timeSlot.minutes == b.timeSlot.minutes) {
	                    return 0;
	                }
	                else {
	                    return -1;
	                }
	            }
	            else {
	                return -1;
	            }
	        });
	        return conferences;
	    };
	    ScheduleController.prototype.GenerateConferences = function () {
	        var conferences = this.SortConferenceByTime(this.mEventDays[0].date);
	        conferences = conferences.concat(this.SortConferenceByTime(this.mEventDays[1].date));
	        conferences = conferences.concat(this.SortConferenceByTime(this.mEventDays[2].date));
	        var max = conferences.length;
	        for (var i = 0; i < max; i++) {
	            var conference = conferences[i];
	            var binding = new ComponentBinding_1.default(new AbstractView_1.default(), conference);
	            if (conference.break) {
	                binding.Template = "templates/conference/break.html";
	            }
	            else {
	                binding.Template = "templates/conference/conference.html";
	            }
	            this.mListComponent.AddComponent(binding);
	        }
	        this.mListComponent.AddEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.OnConferenceTemplateLoaded, this);
	        this.mListComponent.LoadWithTemplate();
	    };
	    ScheduleController.prototype.ShowOptionMenu = function () {
	        var menu = document.getElementById("schedule-menu-option");
	        var content = document.getElementById("schedule-content-wrapper");
	        var scheduleButton1 = document.getElementById("schedule-btn-" + this.mEventDays[0].date);
	        var scheduleButton2 = document.getElementById("schedule-btn-" + this.mEventDays[1].date);
	        var scheduleButton3 = document.getElementById("schedule-btn-" + this.mEventDays[2].date);
	        var scheduleButtonOption = document.getElementById("schedule-option");
	        if (menu.classList.contains("schedule-menu-option-shown")) {
	            scheduleButton1.classList.remove("schedule-btn-date-hidden");
	            scheduleButton2.classList.remove("schedule-btn-date-hidden");
	            scheduleButton3.classList.remove("schedule-btn-date-hidden");
	            scheduleButtonOption.classList.remove("schedule-btn-option-full");
	            menu.classList.remove("schedule-menu-option-shown");
	            content.classList.remove("hidden");
	        }
	        else {
	            scheduleButton1.classList.add("schedule-btn-date-hidden");
	            scheduleButton2.classList.add("schedule-btn-date-hidden");
	            scheduleButton3.classList.add("schedule-btn-date-hidden");
	            scheduleButtonOption.classList.add("schedule-btn-option-full");
	            menu.classList.add("schedule-menu-option-shown");
	            content.classList.add("hidden");
	        }
	    };
	    ScheduleController.prototype.FilterEventByType = function (aSubjectType) {
	        var filterIndex = this.mTypeFilters.indexOf(aSubjectType);
	        var button = document.getElementById("tag-" + aSubjectType.subjectSlug);
	        if (filterIndex < 0) {
	            this.mTypeFilters.push(aSubjectType);
	            button.classList.add("tag-on");
	            button.classList.remove("tag-off");
	        }
	        else {
	            this.mTypeFilters.splice(filterIndex, 1);
	            button.classList.remove("tag-on");
	            button.classList.add("tag-off");
	        }
	        this.RenderFilteredEvent();
	    };
	    ScheduleController.prototype.FilterEventByDate = function (aDay) {
	        var button;
	        if (this.mDayFilters.length > 0) {
	            button = document.getElementById("schedule-btn-" + this.mDayFilters.pop());
	            button.classList.remove("selected");
	            button.classList.add("schedule-btn-date");
	        }
	        this.mDayFilters.push(aDay);
	        button = document.getElementById("schedule-btn-" + aDay);
	        button.classList.add("selected");
	        button.classList.remove("schedule-btn-date");
	        this.RenderFilteredEvent();
	    };
	    ScheduleController.prototype.RenderFilteredEvent = function () {
	        this.mListComponent.RemoveAllComponents();
	        var componentBindings = this.mListComponent.GetComponentBindings();
	        var componentBindingsLength = componentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            var componentBinding = componentBindings[i];
	            var conference = componentBinding.Data;
	            for (var j = 0, dayFiltersLength = this.mDayFilters.length; j < dayFiltersLength; j++) {
	                if (conference.timeSlot.day == this.mDayFilters[j]) {
	                    var typeFiltersLength = this.mTypeFilters.length;
	                    if (typeFiltersLength == 0 || conference.break) {
	                        this.mListComponent.AddComponent(componentBinding);
	                    }
	                    else {
	                        for (var k = 0; k < typeFiltersLength; k++) {
	                            if (conference.subjectType == this.mTypeFilters[k]) {
	                                this.mListComponent.AddComponent(componentBinding);
	                                break;
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	    };
	    ScheduleController.prototype.OnConferenceTemplateLoaded = function (aEvent) {
	        this.mListComponent.RemoveEventListener(ComponentEvent_1.default.ALL_ITEMS_READY, this.OnConferenceTemplateLoaded, this);
	        var componentBindings = this.mListComponent.GetComponentBindings();
	        var componentBindingsLength = componentBindings.length;
	        for (var i = 0; i < componentBindingsLength; i++) {
	            var componentBinding = componentBindings[i];
	            componentBinding.HTML = document.getElementById("conference-view-" + componentBinding.Data.ID);
	            if (componentBinding.Data.break) {
	                continue;
	            }
	            this.mScheduleView.AddClickControl(componentBinding.HTML);
	            this.mScheduleView.AddClickControl(document.getElementById("speaker" + componentBinding.Data.ID));
	        }
	        this.FilterEventByDate(this.mEventDays[0].date);
	        this.mReady = true;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    ScheduleController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id.indexOf("conference-view-") >= 0) {
	            var conferenceID = element.id.split("conference-view-")[1];
	            var conference = this.mListComponent.GetDataByID(conferenceID);
	            if (conference == this.mCurrentConference) {
	                this.ShowConference(this.mCurrentConference);
	            }
	            else {
	                cortex_toolkit_js_router_1.Router.GetInstance().Navigate(conference.slug);
	            }
	        }
	        else if (element.id.indexOf("schedule-btn") >= 0) {
	            this.FilterEventByDate(Number(element.id.split("schedule-btn-")[1]));
	        }
	        else if (element.id.indexOf("tag-") >= 0) {
	            this.FilterEventByType(this.GetSubjectTypeBySlug(element.id.split("tag-")[1]));
	        }
	        else if (element.id == "schedule-option") {
	            this.ShowOptionMenu();
	        }
	        else if (element.id.indexOf("speaker") >= 0) {
	            var conferenceID = element.id.split("speaker")[1];
	            var conference = this.mListComponent.GetDataByID(conferenceID);
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate(conference.speaker.slug);
	        }
	    };
	    ScheduleController.prototype.GetSubjectTypeBySlug = function (aSubjectSlug) {
	        var subjectTypes = this.mSubjectTypeModel.GetSubjectTypes();
	        for (var i = 0, max = subjectTypes.length; i < max; i++) {
	            if (subjectTypes[i].subjectSlug == aSubjectSlug) {
	                return subjectTypes[i];
	            }
	        }
	        return null;
	    };
	    ScheduleController.prototype.ShowConference = function (aConference) {
	        var element;
	        var collapsed = "conference-content conference-collapsed";
	        var expanded = "conference-content conference-expanded";
	        if (aConference != this.mCurrentConference && this.mCurrentConference != null) {
	            element = document.getElementById("conference-toggleElement-" + this.mCurrentConference.ID);
	            if (element) {
	                element.className = collapsed;
	            }
	        }
	        this.mCurrentConference = aConference;
	        if (this.mDayFilters.indexOf(aConference.timeSlot.day) < 0) {
	            this.FilterEventByDate(aConference.timeSlot.day);
	        }
	        element = document.getElementById("conference-toggleElement-" + this.mCurrentConference.ID);
	        if (element.className === collapsed) {
	            element.className = expanded;
	            document.getElementById("schedule-content-wrapper").scrollTop = element.offsetTop - (element.scrollHeight / 2);
	        }
	        else {
	            element.className = collapsed;
	        }
	    };
	    return ScheduleController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScheduleController;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseSwipeEvent_1 = __webpack_require__(4);
	var TouchBehavior_1 = __webpack_require__(38);
	var Mouse_1 = __webpack_require__(75);
	var SwipeController = (function (_super) {
	    __extends(SwipeController, _super);
	    function SwipeController() {
	        _super.call(this);
	        this.mIsSwiping = false;
	        Mouse_1.default.Start();
	    }
	    SwipeController.prototype.InitOnElement = function (aElementId) {
	        var element = document.getElementById(aElementId);
	        this.mTouchBehavior = new TouchBehavior_1.default();
	        this.mTouchBehavior.AddClickControl(element);
	        this.mTouchBehavior.AddEventListener(MouseSwipeEvent_1.default.SWIPE_BEGIN, this.OnMouseSwipeEvent, this);
	        this.mTouchBehavior.AddEventListener(MouseSwipeEvent_1.default.SWIPE_MOVE, this.OnMouseSwipeEvent, this);
	        this.mTouchBehavior.AddEventListener(MouseSwipeEvent_1.default.SWIPE_END, this.OnMouseSwipeEvent, this);
	    };
	    SwipeController.prototype.OnMouseSwipeEvent = function (aEvent) {
	        switch (aEvent.eventName) {
	            case MouseSwipeEvent_1.default.SWIPE_BEGIN:
	                this.HandleSwipeBegin(aEvent);
	                break;
	            case MouseSwipeEvent_1.default.SWIPE_MOVE:
	                this.HandleSwipeMove(aEvent);
	                break;
	            default:
	            case MouseSwipeEvent_1.default.SWIPE_END:
	                this.HandleSwipeEnd();
	                break;
	        }
	    };
	    SwipeController.prototype.HandleSwipeBegin = function (aEvent) {
	        if (this.mIsSwiping) {
	            return;
	        }
	        ;
	        this.mIsSwiping = true;
	        this.mSwipeStartX = aEvent.locationX;
	        this.mTimeStart = new Date().getTime();
	    };
	    SwipeController.prototype.HandleSwipeMove = function (aEvent) {
	        if (!this.mIsSwiping) {
	            return;
	        }
	        ;
	        var currentTime = new Date().getTime();
	        var difference = currentTime - this.mTimeStart;
	        if (difference > SwipeController.SWIPE_TIME_OUT) {
	            this.HandleSwipeEnd();
	            return;
	        }
	        var mouseX = aEvent.locationX;
	        var diffX = this.mSwipeStartX - mouseX;
	        this.mSwipeStartX = mouseX;
	        if (Math.abs(diffX) >= SwipeController.SWIPE_SENSIBILITY) {
	            var direction = diffX < 0 ?
	                MouseSwipeEvent_1.default.SWIPE_LEFT :
	                MouseSwipeEvent_1.default.SWIPE_RIGHT;
	            this.DispatchEvent(new MouseSwipeEvent_1.default(direction));
	            this.HandleSwipeEnd();
	        }
	    };
	    SwipeController.prototype.HandleSwipeEnd = function () {
	        if (this.mIsSwiping) {
	            this.mIsSwiping = false;
	        }
	    };
	    SwipeController.SWIPE_SENSIBILITY = 40;
	    SwipeController.SWIPE_TIME_OUT = 500;
	    return SwipeController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SwipeController;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var Point_1 = __webpack_require__(39);
	var Mouse = (function () {
	    function Mouse() {
	    }
	    Mouse.GetX = function () { return (this.mPosition.X); };
	    Mouse.GetY = function () { return (this.mPosition.Y); };
	    Mouse.GetPosition = function () { return (this.mPosition); };
	    Mouse.OnMouseMove = function (aEvent) {
	        Mouse.mPosition.X = aEvent.clientX || aEvent.pageX;
	        Mouse.mPosition.Y = aEvent.clientY || aEvent.pageY;
	    };
	    Mouse.Start = function () {
	        document.addEventListener("mousemove", Mouse.OnMouseMove);
	    };
	    Mouse.Stop = function () {
	        document.removeEventListener("mousemove", Mouse.OnMouseMove);
	    };
	    Mouse.mPosition = new Point_1.default(0, 0);
	    return Mouse;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Mouse;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(6);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(33);
	var MouseTouchEvent_1 = __webpack_require__(32);
	var cortex_toolkit_js_router_1 = __webpack_require__(7);
	var TicketsController = (function (_super) {
	    __extends(TicketsController, _super);
	    function TicketsController() {
	        _super.call(this);
	        this.Init();
	    }
	    TicketsController.prototype.Init = function () {
	        this.mTicketsView = new AbstractView_1.default();
	        this.mTicketsView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mTicketsView.LoadTemplate("templates/tickets/tickets.html");
	    };
	    TicketsController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("tickets-view");
	        document.getElementById("content-current").removeChild(scheduleHTMLElement);
	        this.mTicketsView.Destroy();
	        this.mTicketsView = null;
	    };
	    TicketsController.prototype.GetRouteList = function () { return TicketsController.routeList; };
	    TicketsController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("content-loading").innerHTML += this.mTicketsView.RenderTemplate({});
	        this.mTicketsView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mTicketsView.AddClickControl(document.getElementById("tickets-info-button"));
	        this.mTicketsView.AddClickControl(document.getElementById("tickets-eventbrite"));
	        this.mTicketsView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    TicketsController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id == "tickets-info-button") {
	            cortex_toolkit_js_router_1.Router.GetInstance().Navigate("contact");
	        }
	        else if (element.id == "tickets-eventbrite") {
	            window.open("http://www.eventbrite.com/e/billets-web-a-quebec-2016-6e-edition-18295299734", "_blank");
	        }
	    };
	    TicketsController.routeList = ["tickets"];
	    return TicketsController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TicketsController;


/***/ }
/******/ ]);