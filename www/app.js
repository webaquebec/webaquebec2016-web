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
	var MVCEvent_1 = __webpack_require__(3);
	var Router_1 = __webpack_require__(5);
	var HeaderController_1 = __webpack_require__(7);
	var ContactController_1 = __webpack_require__(22);
	var HomeController_1 = __webpack_require__(23);
	var MenuItemModel_1 = __webpack_require__(18);
	var ProfileController_1 = __webpack_require__(24);
	var ScheduleController_1 = __webpack_require__(25);
	var TicketsController_1 = __webpack_require__(29);
	var Main = (function (_super) {
	    __extends(Main, _super);
	    function Main() {
	        _super.call(this);
	        this.Init();
	    }
	    Main.prototype.Init = function () {
	        MenuItemModel_1.default.GetInstance();
	        this.mHeaderController = new HeaderController_1.default();
	        this.SetupRouting();
	    };
	    Main.prototype.KeyPressed = function (aKeyList) {
	    };
	    Main.prototype.SetupRouting = function () {
	        var router = Router_1.default.GetInstance();
	        router.AddHandler("", this.ShowHomeScreen.bind(this));
	        router.AddHandler("schedule", this.ShowSchedule.bind(this));
	        router.AddHandler("tickets", this.ShowTickets.bind(this));
	        router.AddHandler("profile", this.ShowProfile.bind(this));
	        router.AddHandler("contact", this.ShowContact.bind(this));
	        router.Reload();
	    };
	    Main.prototype.ShowHomeScreen = function () {
	        this.SetupNavigable("home", HomeController_1.default);
	    };
	    Main.prototype.ShowSchedule = function () {
	        this.SetupNavigable("schedule", ScheduleController_1.default);
	    };
	    Main.prototype.ShowTickets = function () {
	        this.SetupNavigable("tickets", TicketsController_1.default);
	    };
	    Main.prototype.ShowProfile = function () {
	        this.SetupNavigable("profile", ProfileController_1.default);
	    };
	    Main.prototype.ShowContact = function () {
	        this.SetupNavigable("contact", ContactController_1.default);
	    };
	    Main.prototype.SetupNavigable = function (aName, aControllerClass) {
	        if (aName == this.mCurrentAction)
	            return;
	        aName = (aName == null) ? "" : aName;
	        this.mCurrentAction = aName;
	        this.mPreviousController = this.mCurrentController;
	        this.mCurrentController = new aControllerClass();
	        this.mCurrentController.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	    };
	    Main.prototype.OnNewControllerLoaded = function () {
	        this.mCurrentController.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnNewControllerLoaded, this);
	        var contentCurrent = document.getElementById("content-current");
	        var contentLoading = document.getElementById("content-loading");
	        if (this.mPreviousController == null) {
	            contentCurrent.id = "content-loading";
	            contentLoading.id = "content-current";
	            contentLoading.className = "position-none";
	            contentCurrent.className = "position-right";
	        }
	        else {
	            contentLoading.className = "position-none animated";
	            contentCurrent.className = "position-left animated";
	            window.setTimeout(this.FinishControllerTransition.bind(this), 700);
	        }
	    };
	    Main.prototype.FinishControllerTransition = function () {
	        this.mPreviousController.Destroy();
	        this.mPreviousController = null;
	        var contentCurrent = document.getElementById("content-current");
	        var contentLoading = document.getElementById("content-loading");
	        contentCurrent.id = "content-loading";
	        contentLoading.id = "content-current";
	        contentLoading.className = "position-none";
	        contentCurrent.className = "position-right";
	    };
	    return Main;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Main;
	new Main();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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
/***/ function(module, exports, __webpack_require__) {

	/*
	 All information contained herein is, and remains
	 the property of Cortex Media and its suppliers,
	 if any.  The intellectual and technical concepts contained
	 herein are proprietary to Cortex Media and its suppliers
	 and may be covered by Canada and Foreign Patents,
	 and are protected by trade secret or copyright law.
	 Dissemination of this information or reproduction of this material
	 is strictly forbidden unless prior written permission is obtained
	 from Cortex Media.
	 
	 @copyright    Cortex Media 2014
	 @author Mathieu 'Sanchez' Cote
	 */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(4);
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
/* 4 */
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
	 * @author Mathieu 'Sanchez' Cote
	 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Route_1 = __webpack_require__(6);
	var Router = (function () {
	    function Router() {
	        this.mRoutes = new Array();
	        this.mMap = {};
	        this.mOldReference = window[Router.REFERENCE];
	        this.AddListener();
	        window[Router.REFERENCE] = this;
	    }
	    Router.GetInstance = function () {
	        if (Router.mInstance == null)
	            Router.mInstance = new Router();
	        return Router.mInstance;
	    };
	    Router.prototype.AddHandler = function (aPath, aCallback) {
	        var s = aPath.split(' ');
	        var name = (s.length == 2) ? s[0] : null;
	        aPath = (s.length == 2) ? s[1] : s[0];
	        if (!this.mMap[aPath]) {
	            this.mMap[aPath] = new Route_1.default(aPath, name);
	            this.mRoutes.push(this.mMap[aPath]);
	        }
	        this.mMap[aPath].AddHandler(aCallback);
	    };
	    Router.prototype.Lookup = function (aPath, aParam) {
	        var routesLength = this.mRoutes.length;
	        for (var i = 0, c = routesLength; i < c; i++) {
	            var route = this.mRoutes[i];
	            if (route.Path == name) {
	                return route.ToURL(aParam);
	            }
	        }
	        return null;
	    };
	    Router.prototype.Remove = function (aPath, aCallback) {
	        var route = this.mMap[aPath];
	        if (!route)
	            return;
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
	    Router.prototype.NoConflict = function () {
	        window[Router.REFERENCE] = this.mOldReference;
	        return this;
	    };
	    ;
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
	            if (this.CheckRoute(hash, route))
	                return;
	        }
	    };
	    Router.prototype.AddListener = function () {
	        if (window.addEventListener) {
	            window.addEventListener('hashchange', this.Reload.bind(this), false);
	        }
	        else {
	            window["attachEvent"]('onhashchange', this.Reload.bind(this));
	        }
	    };
	    Router.prototype.RemoveListener = function () {
	        if (window.removeEventListener) {
	            window.removeEventListener('hashchange', this.Reload.bind(this));
	        }
	        else {
	            window["detachEvent"]('onhashchange', this.Reload.bind(this));
	        }
	    };
	    Router.REFERENCE = "routie";
	    return Router;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Router;


/***/ },
/* 6 */
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
	        if (!execArray)
	            return false;
	        for (var i = 1, len = execArray.length; i < len; ++i) {
	            var key = this.mKeys[i - 1];
	            var value = ('string' == typeof execArray[i]) ? decodeURIComponent(execArray[i]) : execArray[i];
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
	            path = path.replace('/:' + param, '/' + params[param]);
	        }
	        path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
	        if (path.indexOf(':') != -1) {
	            throw new Error('missing parameters for url: ' + path);
	        }
	        return path;
	    };
	    Route.prototype.PathToRegExp = function (aPath, aKeys, aSensitive, aStrict) {
	        if (aPath instanceof RegExp)
	            return aPath;
	        if (aPath instanceof Array)
	            aPath = '(' + aPath.join('|') + ')';
	        aPath = aPath
	            .concat(aStrict ? '' : '/?')
	            .replace(/\/\(/g, '(?:/')
	            .replace(/\+/g, '__plus__')
	            .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
	            aKeys.push({ name: key, optional: !!optional });
	            slash = slash || '';
	            return '' + (optional ? '' : slash) + '(?:' +
	                (optional ? slash : '') +
	                (format || '') +
	                (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' +
	                (optional || '');
	        })
	            .replace(/([\/.])/g, '\\$1')
	            .replace(/__plus__/g, '(.+)')
	            .replace(/\*/g, '(.*)');
	        return new RegExp('^' + aPath + '$', aSensitive ? '' : 'i');
	    };
	    return Route;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Route;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(8);
	var MVCEvent_1 = __webpack_require__(3);
	var AbstractView_1 = __webpack_require__(9);
	var MenuEvent_1 = __webpack_require__(15);
	var MenuController_1 = __webpack_require__(16);
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
	        this.mHeaderView.AddClickControl(document.getElementById("header-btn-menu"));
	        this.mHeaderView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	    };
	    HeaderController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id == "header-btn-menu") {
	            this.OnMenuClicked();
	        }
	    };
	    HeaderController.prototype.OnMenuClicked = function () {
	        this.HideMenuButton();
	        this.mMenuController.Show();
	    };
	    HeaderController.prototype.OnMenuClose = function () {
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/******
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
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(4);
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/******
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
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var LazyLoader_1 = __webpack_require__(10);
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(8);
	var MVCEvent_1 = __webpack_require__(3);
	var TouchBehavior_1 = __webpack_require__(12);
	var Templating_1 = __webpack_require__(14);
	var AbstractView = (function (_super) {
	    __extends(AbstractView, _super);
	    function AbstractView(aID) {
	        if (aID === void 0) { aID = ""; }
	        _super.call(this);
	        this.mID = aID;
	    }
	    AbstractView.prototype.Destroy = function () {
	        if (this.mTouchBehavior != null)
	            this.mTouchBehavior.Destroy();
	        this.mTouchBehavior = null;
	        this.mData = null;
	        this.mTemplateHTML = null;
	    };
	    AbstractView.prototype.LoadTemplate = function (aTemplatePath) {
	        var _this = this;
	        var promise = LazyLoader_1.default.loadTemplate(aTemplatePath);
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
	        }
	        this.mTouchBehavior.AddClickControl(aElement);
	        this.mTouchBehavior.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnTouched, this);
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

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
	 * @copyright Cortex Media 2015
	 *
	 * @author Mathieu Rhéaume
	 */
	var promise_1 = __webpack_require__(11);
	var LazyLoader = (function () {
	    function LazyLoader() {
	    }
	    LazyLoader.loadJSON = function (aFile, aApiToken, aDatastoreObject) {
	        var deferObject = promise_1.default.defer();
	        if (aDatastoreObject != null && aDatastoreObject.get(aFile) != null) {
	            deferObject.resolve(aDatastoreObject.get(aFile));
	        }
	        else {
	            var xhr = new XMLHttpRequest();
	            xhr.open("GET", aFile, true);
	            try {
	                xhr.responseType = "json";
	            }
	            catch (e) {
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
	    LazyLoader.loadFile = function (aFile) {
	        var deferObject = promise_1.default.defer(), xhr = new XMLHttpRequest();
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
	    LazyLoader.loadTemplate = function (aFile) {
	        var deferObject = promise_1.default.defer(), xhr = new XMLHttpRequest();
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
	    LazyLoader.sendJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
	        var deferObject = promise_1.default.defer(), xhr = this.getXHRObject("POST", aFile, aSyncOrNot, aApiToken);
	        xhr.onerror = function (error) {
	            deferObject.reject(error);
	        };
	        xhr.onload = function () {
	            LazyLoader.handleXHRReponse(xhr, deferObject);
	        };
	        xhr.send(JSON.stringify(aJsonObject));
	        return deferObject.promise();
	    };
	    LazyLoader.updateJSON = function (aFile, aJsonObject, aSyncOrNot, aApiToken) {
	        var deferObject = promise_1.default.defer(), xhr = this.getXHRObject("PUT", aFile, aSyncOrNot, aApiToken);
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
	        var deferObject = promise_1.default.defer();
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
/* 11 */
/***/ function(module, exports) {

	var P;
	(function (P) {
	    function defer() {
	        return new DeferredI();
	    }
	    P.defer = defer;
	    function resolve(v) {
	        return defer().resolve(v).promise();
	    }
	    P.resolve = resolve;
	    function reject(err) {
	        return defer().reject(err).promise();
	    }
	    P.reject = reject;
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
	    (function (Status) {
	        Status[Status["Unfulfilled"] = 0] = "Unfulfilled";
	        Status[Status["Rejected"] = 1] = "Rejected";
	        Status[Status["Resolved"] = 2] = "Resolved";
	    })(P.Status || (P.Status = {}));
	    var Status = P.Status;
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
	    function isUndefined(v) {
	        return typeof v === 'undefined';
	    }
	    P.isUndefined = isUndefined;
	})(P || (P = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = P;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/******
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
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var MouseTouchEvent_1 = __webpack_require__(8);
	var Point_1 = __webpack_require__(13);
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
	        aElement.addEventListener("mouseup", this.OnMouseUp.bind(this));
	    };
	    TouchBehavior.prototype.RemoveClickControl = function (aElement) {
	        var elementIndex = this.mElementList.indexOf(aElement);
	        var element = this.mElementList[elementIndex];
	        element.removeEventListener("touchstart", this.OnTouchStart.bind(this));
	        element.removeEventListener("touchmove", this.OnTouchMove.bind(this));
	        element.removeEventListener("touchend", this.OnTouchEnd.bind(this));
	        element.removeEventListener("mouseup", this.OnMouseUp.bind(this));
	        this.mElementList.splice(elementIndex, 1);
	    };
	    TouchBehavior.prototype.OnMouseUp = function (aEvent) {
	        var touchEvent = new MouseTouchEvent_1.default(MouseTouchEvent_1.default.TOUCHED);
	        touchEvent.target = aEvent.target;
	        touchEvent.currentTarget = aEvent.currentTarget;
	        this.DispatchEvent(touchEvent);
	    };
	    TouchBehavior.prototype.OnTouchStart = function (aEvent) {
	        this.mLastTouchEvent = aEvent;
	        this.mTouchTarget = aEvent.target;
	        var firstTouch = aEvent.targetTouches.item(0);
	        this.mMousePosition.X = firstTouch.clientX || firstTouch.pageX;
	        this.mMousePosition.Y = firstTouch.clientY || firstTouch.pageY;
	    };
	    TouchBehavior.prototype.OnTouchMove = function (aEvent) {
	        this.mLastTouchEvent = aEvent;
	    };
	    TouchBehavior.prototype.OnTouchEnd = function (aEvent) {
	        var endTouch = this.mLastTouchEvent.targetTouches.item(0);
	        var endTouchX = endTouch.clientX || endTouch.pageX;
	        var endTouchY = endTouch.clientY || endTouch.pageY;
	        if (this.mTouchTarget === this.mLastTouchEvent.target &&
	            this.mMousePosition.X === endTouchX &&
	            this.mMousePosition.Y === endTouchY) {
	            var touchEvent = new MouseTouchEvent_1.default(MouseTouchEvent_1.default.TOUCHED);
	            touchEvent.target = aEvent.target;
	            touchEvent.currentTarget = aEvent.currentTarget;
	            this.DispatchEvent(touchEvent);
	        }
	    };
	    return TouchBehavior;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TouchBehavior;


/***/ },
/* 13 */
/***/ function(module, exports) {

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
	 * @copyright Cortex Media 2015
	 *
	 * @author Mathieu 'Sanchez' Cote
	 */
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
/* 14 */
/***/ function(module, exports) {

	var Templating = (function () {
	    function Templating() {
	    }
	    Templating.Render = function (aTemplate, aData) {
	        var f = !/[^\w\-\.:]/.test(aTemplate) ? this.cache[aTemplate] = this.cache[aTemplate] ||
	            this.Render(this.load(aTemplate)) :
	            new Function(this.arg + ',tmpl', "var _e=tmpl.encode" +
	                this.helper +
	                ",_s='" +
	                aTemplate.replace(this.regexp, this.func) +
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
	        return (s == null ? "" : "" + s).replace(this.encReg, function (c) {
	            return this.encMap[c] || "";
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Event_1 = __webpack_require__(4);
	var MenuEvent = (function (_super) {
	    __extends(MenuEvent, _super);
	    function MenuEvent(aEventName) {
	        _super.call(this, aEventName);
	    }
	    MenuEvent.SHOW_MENU = "com.cortex.waq.menu.event.MenuEvent::SHOW_MENU";
	    MenuEvent.CLOSE_MENU = "com.cortex.waq.menu.event.MenuEvent::CLOSE_MENU";
	    return MenuEvent;
	})(Event_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuEvent;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ListComponent_1 = __webpack_require__(17);
	var MouseTouchEvent_1 = __webpack_require__(8);
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(9);
	var Router_1 = __webpack_require__(5);
	var MenuEvent_1 = __webpack_require__(15);
	var MenuItemModel_1 = __webpack_require__(18);
	var MenuController = (function (_super) {
	    __extends(MenuController, _super);
	    function MenuController() {
	        _super.call(this);
	        this.Init();
	    }
	    MenuController.prototype.Init = function () {
	        MenuItemModel_1.default.GetInstance().AddEventListener("", this.OnJSONParsed, this);
	        this.OnJSONParsed();
	    };
	    MenuController.prototype.Destroy = function () {
	        var menuHTMLElement = document.getElementById("menu-view");
	        document.getElementById("overlay").removeChild(menuHTMLElement);
	        this.mListComponent.Destroy();
	        this.mListComponent = null;
	        this.mMenuView.Destroy();
	        this.mMenuView = null;
	        _super.prototype.Destroy.call(this);
	    };
	    MenuController.prototype.Hide = function () {
	        var menuHTMLElement = document.getElementById("menu-view");
	        if (menuHTMLElement != null)
	            menuHTMLElement.className = "hidden";
	    };
	    MenuController.prototype.Show = function () {
	        var menuHTMLElement = document.getElementById("menu-view");
	        if (menuHTMLElement != null)
	            menuHTMLElement.className = "";
	    };
	    MenuController.prototype.OnJSONParsed = function () {
	        MenuItemModel_1.default.GetInstance().RemoveEventListener("", this.OnJSONParsed, this);
	        this.mMenuView = new AbstractView_1.default();
	        this.mMenuView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mMenuView.LoadTemplate("templates/menu/menu.html");
	    };
	    MenuController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("overlay").innerHTML += this.mMenuView.RenderTemplate({});
	        this.mMenuView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mMenuView.AddClickControl(document.getElementById("menu-close"));
	        this.mMenuView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mListComponent = new ListComponent_1.default();
	        this.mListComponent.Init("menu-menuItemContainer");
	        this.GenerateMenuItems();
	        this.Hide();
	    };
	    MenuController.prototype.GenerateMenuItems = function () {
	        var menuItems = MenuItemModel_1.default.GetInstance().GetMenuItems();
	        menuItems.sort(function (a, b) {
	            if (a.order < b.order)
	                return -1;
	            if (a.order > b.order)
	                return 1;
	            return 0;
	        });
	        var max = menuItems.length;
	        for (var i = 0; i < max; i++) {
	            var menuItemView = new AbstractView_1.default();
	            menuItemView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnMenuItemTemplateLoaded, this);
	            this.mListComponent.AddComponent(menuItemView, "templates/menu/menuItem.html", menuItems[i]);
	        }
	    };
	    MenuController.prototype.OnMenuItemTemplateLoaded = function (aEvent) {
	        var menuItem = this.mListComponent.GetDataByComponent(aEvent.target);
	        this.mMenuView.AddClickControl(document.getElementById("menu-menuItem" + menuItem.ID));
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
	        Router_1.default.GetInstance().Navigate(menuItem.action);
	        this.DispatchEvent(new MenuEvent_1.default(MenuEvent_1.default.CLOSE_MENU));
	    };
	    return MenuController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuController;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

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
	 * @author Mathieu 'Sanchez' Cote
	 */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var ListComponent = (function (_super) {
	    __extends(ListComponent, _super);
	    function ListComponent() {
	        _super.call(this);
	    }
	    ListComponent.prototype.Init = function (aComponentListID) {
	        this.mComponentDataBinding = new Array();
	        this.mComponentCreated = 0;
	        this.mComponentListHTML = document.getElementById(aComponentListID);
	    };
	    ListComponent.prototype.Destroy = function () {
	        this.mComponentDataBinding.length = 0;
	        this.mComponentDataBinding = null;
	        this.mComponentListHTML = null;
	    };
	    Object.defineProperty(ListComponent.prototype, "ComponentListHTML", {
	        get: function () { return (this.mComponentListHTML); },
	        enumerable: true,
	        configurable: true
	    });
	    ListComponent.prototype.GetDataList = function () {
	        var dataList = new Array();
	        var componentDataBindingLength = this.mComponentDataBinding.length;
	        for (var i = 0; i < componentDataBindingLength; i++) {
	            dataList.push(this.mComponentDataBinding[i].data);
	        }
	        return (dataList);
	    };
	    ListComponent.prototype.GetDataByComponent = function (aComponent) {
	        var componentDataBindingLength = this.mComponentDataBinding.length;
	        for (var i = 0; i < componentDataBindingLength; i++) {
	            if (this.mComponentDataBinding[i].component == aComponent) {
	                return (this.mComponentDataBinding[i].data);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.GetDataByID = function (aID) {
	        var componentDataBindingLength = this.mComponentDataBinding.length;
	        for (var i = 0; i < componentDataBindingLength; i++) {
	            if (this.mComponentDataBinding[i].data.ID == aID) {
	                return (this.mComponentDataBinding[i].data);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.GetComponentByData = function (aData) {
	        var componentDataBindingLength = this.mComponentDataBinding.length;
	        for (var i = 0; i < componentDataBindingLength; i++) {
	            if (this.mComponentDataBinding[i].data == aData) {
	                return (this.mComponentDataBinding[i].component);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.GetComponentByID = function (aID) {
	        var componentDataBindingLength = this.mComponentDataBinding.length;
	        for (var i = 0; i < componentDataBindingLength; i++) {
	            if (this.mComponentDataBinding[i].data.ID == aID) {
	                return (this.mComponentDataBinding[i].component);
	            }
	        }
	        return (null);
	    };
	    ListComponent.prototype.AddComponent = function (aComponentView, aTemplate, aData, aKeepID) {
	        if (aKeepID === void 0) { aKeepID = false; }
	        if (!aKeepID) {
	            aData.ID = this.mComponentCreated.toString();
	            this.mComponentCreated++;
	        }
	        aComponentView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnComponentTemplateLoaded, this);
	        aComponentView.LoadTemplate(aTemplate);
	        this.mComponentDataBinding.push({ component: aComponentView, data: aData });
	    };
	    ListComponent.prototype.OnComponentTemplateLoaded = function (aEvent) {
	        var componentView = aEvent.target;
	        var componentData = this.GetDataByComponent(componentView);
	        this.mComponentListHTML.insertAdjacentHTML("beforeend", componentView.RenderTemplate(componentData));
	    };
	    ListComponent.prototype.RemoveComponent = function (aElementIDList, aComponent) {
	        var componentDataBindingLength = this.mComponentDataBinding.length;
	        for (var i = 0; i < componentDataBindingLength; i++) {
	            if (this.mComponentDataBinding[i].component == aComponent) {
	                break;
	            }
	        }
	        this.mComponentDataBinding.splice(i, 1);
	        for (var j = 0; j < aElementIDList.length; j++) {
	            var componentToRemoveHTML = document.getElementById(aElementIDList[j]);
	            this.mComponentListHTML.removeChild(componentToRemoveHTML);
	        }
	    };
	    return ListComponent;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ListComponent;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AbstractModel_1 = __webpack_require__(19);
	var MenuItem_1 = __webpack_require__(20);
	var MenuItemModel = (function (_super) {
	    __extends(MenuItemModel, _super);
	    function MenuItemModel() {
	        _super.call(this);
	        this.mMenuItems = [];
	        this.CreateMenuItems();
	    }
	    MenuItemModel.GetInstance = function () {
	        if (MenuItemModel.mInstance == null)
	            MenuItemModel.mInstance = new MenuItemModel();
	        return MenuItemModel.mInstance;
	    };
	    MenuItemModel.prototype.CreateMenuItems = function () {
	        this.Fetch("json/waq/menu_items.json");
	    };
	    MenuItemModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        var totalItems = json.length;
	        for (var i = 0; i < totalItems; i++) {
	            var menuItem = new MenuItem_1.default();
	            menuItem.FromJSON(json[i]);
	            this.mMenuItems.push(menuItem);
	        }
	    };
	    MenuItemModel.prototype.GetMenuItems = function () {
	        return this.mMenuItems;
	    };
	    return MenuItemModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MenuItemModel;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var LazyLoader_1 = __webpack_require__(10);
	var MVCEvent_1 = __webpack_require__(3);
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
	        var promise = LazyLoader_1.default.loadJSON(aURL);
	        promise.then(function () { return _this.OnJSONLoadSuccess(promise.result, aURL); });
	        promise.fail(function () { return _this.OnJSONLoadError(aURL); });
	    };
	    AbstractModel.prototype.GetData = function (aURL) {
	        return this.mDataCache[aURL];
	    };
	    AbstractModel.prototype.OnJSONLoadError = function (aURL) {
	        console.log("There was an error loading, ", aURL);
	    };
	    AbstractModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        this.mDataCache[aURL] = aJSONData;
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.JSON_LOADED));
	    };
	    return AbstractModel;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AbstractModel;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(21);
	var MenuItem = (function (_super) {
	    __extends(MenuItem, _super);
	    function MenuItem() {
	        _super.call(this);
	    }
	    MenuItem.prototype.Destroy = function () { };
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(9);
	var ContactController = (function (_super) {
	    __extends(ContactController, _super);
	    function ContactController() {
	        _super.call(this);
	        this.Init();
	    }
	    ContactController.prototype.Init = function () {
	        this.mContactView = new AbstractView_1.default();
	        this.mContactView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mContactView.LoadTemplate("templates/contact/contact.html");
	    };
	    ContactController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("contactView");
	        document.getElementById("core").removeChild(scheduleHTMLElement);
	        this.mContactView.Destroy();
	        this.mContactView = null;
	    };
	    ContactController.prototype.GetRouteList = function () {
	        return ContactController.routeList;
	    };
	    ContactController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("core").innerHTML += this.mContactView.RenderTemplate({});
	        this.mContactView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	    };
	    ContactController.routeList = ["contact"];
	    return ContactController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ContactController;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(9);
	var HomeController = (function (_super) {
	    __extends(HomeController, _super);
	    function HomeController() {
	        _super.call(this);
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
	        document.getElementById("content-loading").innerHTML += this.mHomeView.RenderTemplate({});
	        this.mHomeView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	    };
	    return HomeController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = HomeController;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(9);
	var ProfileController = (function (_super) {
	    __extends(ProfileController, _super);
	    function ProfileController() {
	        _super.call(this);
	        this.Init();
	    }
	    ProfileController.prototype.Init = function () {
	        this.mProfileView = new AbstractView_1.default();
	        this.mProfileView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mProfileView.LoadTemplate("templates/profile/profile.html");
	    };
	    ProfileController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("profileView");
	        document.getElementById("core").removeChild(scheduleHTMLElement);
	        this.mProfileView.Destroy();
	        this.mProfileView = null;
	    };
	    ProfileController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("core").innerHTML += this.mProfileView.RenderTemplate({});
	        this.mProfileView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	    };
	    return ProfileController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ProfileController;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ListComponent_1 = __webpack_require__(17);
	var MouseTouchEvent_1 = __webpack_require__(8);
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(9);
	var ConferenceController_1 = __webpack_require__(26);
	var ScheduleController = (function (_super) {
	    __extends(ScheduleController, _super);
	    function ScheduleController() {
	        _super.call(this);
	        this.Init();
	    }
	    ScheduleController.prototype.Init = function () {
	        this.mScheduleView = new AbstractView_1.default();
	        this.mScheduleView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.mScheduleView.LoadTemplate("templates/schedule/schedule.html");
	        this.mConferenceController = new ConferenceController_1.default();
	    };
	    ScheduleController.prototype.Destroy = function () {
	        var scheduleHTMLElement = document.getElementById("schedule-view");
	        document.getElementById("content-current").removeChild(scheduleHTMLElement);
	        this.mListComponent.Destroy();
	        this.mListComponent = null;
	        this.mScheduleView.Destroy();
	        this.mScheduleView = null;
	    };
	    ScheduleController.prototype.GetRouteList = function () {
	        return ScheduleController.routeList;
	    };
	    ScheduleController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("content-loading").innerHTML += this.mScheduleView.RenderTemplate({});
	        this.mScheduleView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	        this.DispatchEvent(new MVCEvent_1.default(MVCEvent_1.default.TEMPLATE_LOADED));
	        this.mScheduleView.AddEventListener(MouseTouchEvent_1.default.TOUCHED, this.OnScreenClicked, this);
	        this.mListComponent = new ListComponent_1.default();
	        this.mListComponent.Init("schedule-conferenceContainer");
	        this.GenerateConferences();
	    };
	    ScheduleController.prototype.GenerateConferences = function () {
	        var conferences = this.mConferenceController.GetConferences();
	        var max = conferences.length;
	        for (var i = 0; i < max; i++) {
	            var conferenceQuickView = new AbstractView_1.default();
	            conferenceQuickView.AddEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnConferenceTemplateLoaded, this);
	            this.mListComponent.AddComponent(conferenceQuickView, "templates/conference/conferenceToggleView.html", conferences[i]);
	        }
	    };
	    ScheduleController.prototype.OnConferenceTemplateLoaded = function (aEvent) {
	        var conference = this.mListComponent.GetDataByComponent(aEvent.target);
	        this.mScheduleView.AddClickControl(document.getElementById("conference-conferenceToggleView" + conference.ID));
	    };
	    ScheduleController.prototype.OnScreenClicked = function (aEvent) {
	        var element = aEvent.currentTarget;
	        if (element.id.indexOf("conference-conferenceToggleView") >= 0) {
	            this.OnConferenceToggleClicked(element.id);
	        }
	    };
	    ScheduleController.prototype.OnConferenceToggleClicked = function (aElementId) {
	        var conferenceViewId = aElementId.split("conference-conferenceToggleView")[1];
	        var element = document.getElementById("conference-conferenceDetails" + conferenceViewId);
	        element.className = element.className == "" ? "conference-collapsed" : "";
	    };
	    ScheduleController.routeList = ["schedule"];
	    return ScheduleController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ScheduleController;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventDispatcher_1 = __webpack_require__(1);
	var ConferenceModel_1 = __webpack_require__(27);
	var ConferenceController = (function (_super) {
	    __extends(ConferenceController, _super);
	    function ConferenceController() {
	        _super.call(this);
	        this.Init();
	    }
	    ConferenceController.prototype.Init = function () {
	        this.mConferences = ConferenceModel_1.default.GetInstance().GetConferences();
	    };
	    ConferenceController.prototype.GetConferences = function () {
	        return this.mConferences;
	    };
	    ConferenceController.prototype.GetConferencesWithFilters = function (aFilterIds) {
	    };
	    ConferenceController.prototype.GetConferencesForDate = function () {
	    };
	    ConferenceController.prototype.GetConferencesOfSpeaker = function () {
	    };
	    return ConferenceController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ConferenceController;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AbstractModel_1 = __webpack_require__(19);
	var Conference_1 = __webpack_require__(28);
	var ConferenceModel = (function (_super) {
	    __extends(ConferenceModel, _super);
	    function ConferenceModel() {
	        _super.call(this);
	        this.mConferences = [];
	        this.CreateConferences();
	    }
	    ConferenceModel.GetInstance = function () {
	        if (ConferenceModel.mInstance == null)
	            ConferenceModel.mInstance = new ConferenceModel();
	        return ConferenceModel.mInstance;
	    };
	    ConferenceModel.prototype.CreateConferences = function () {
	        this.Fetch("json/waq/conferences.json");
	    };
	    ConferenceModel.prototype.OnJSONLoadSuccess = function (aJSONData, aURL) {
	        _super.prototype.OnJSONLoadSuccess.call(this, aJSONData, aURL);
	        var json = aJSONData;
	        var totalItems = json.length;
	        for (var i = 0; i < totalItems; i++) {
	            var conference = new Conference_1.default();
	            conference.FromJSON(json[i]);
	            this.mConferences.push(conference);
	        }
	    };
	    ConferenceModel.prototype.GetConferences = function () {
	        return this.mConferences;
	    };
	    return ConferenceModel;
	})(AbstractModel_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ConferenceModel;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var ComponentData_1 = __webpack_require__(21);
	var Conference = (function (_super) {
	    __extends(Conference, _super);
	    function Conference() {
	        _super.call(this);
	    }
	    Conference.prototype.Destroy = function () { };
	    Object.defineProperty(Conference.prototype, "conferenceId", {
	        get: function () { return this.mConferenceId; },
	        set: function (aConferenceId) { this.mConferenceId = aConferenceId; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "title", {
	        get: function () { return this.mTitle; },
	        set: function (aTitle) { this.mTitle = aTitle; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "description", {
	        get: function () { return this.mDescription; },
	        set: function (aDescription) { this.mDescription = aDescription; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conference.prototype, "speakerId", {
	        get: function () { return this.mSpeakerId; },
	        set: function (aSpeakerId) { this.mSpeakerId = aSpeakerId; },
	        enumerable: true,
	        configurable: true
	    });
	    Conference.prototype.FromJSON = function (aData) {
	        this.mConferenceId = aData.conferenceId;
	        this.mTitle = aData.title;
	        this.mDescription = aData.description;
	        this.mSpeakerId = aData.speakerId;
	    };
	    return Conference;
	})(ComponentData_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Conference;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var MVCEvent_1 = __webpack_require__(3);
	var EventDispatcher_1 = __webpack_require__(1);
	var AbstractView_1 = __webpack_require__(9);
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
	        var scheduleHTMLElement = document.getElementById("ticketsView");
	        document.getElementById("core").removeChild(scheduleHTMLElement);
	        this.mTicketsView.Destroy();
	        this.mTicketsView = null;
	    };
	    TicketsController.prototype.GetRouteList = function () {
	        return TicketsController.routeList;
	    };
	    TicketsController.prototype.OnTemplateLoaded = function (aEvent) {
	        document.getElementById("core").innerHTML += this.mTicketsView.RenderTemplate({});
	        this.mTicketsView.RemoveEventListener(MVCEvent_1.default.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
	    };
	    TicketsController.routeList = ["tickets"];
	    return TicketsController;
	})(EventDispatcher_1.default);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TicketsController;


/***/ }
/******/ ]);