import EventDispatcher from "../../core/event/EventDispatcher";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import { Router } from "cortex-toolkit-js-router";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractView from "../../core/mvc/AbstractView";

import BlogModel from "../blog/BlogModel";
import BlogPost from "../blog/data/BlogPost";

export default class HomeController extends EventDispatcher {

	private mHomeView:AbstractView;

	private mBlogModel:BlogModel;
	private mLatestBlog:BlogPost;

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mHomeView = new AbstractView();
		this.mHomeView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mHomeView.LoadTemplate("templates/home/home.html");
	}

	public Destroy():void {

		var homeHTMLElement:HTMLElement = document.getElementById("home-view");

		document.getElementById("content-current").removeChild(homeHTMLElement);

		this.mHomeView.Destroy();
		this.mHomeView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		this.mHomeView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		this.mBlogModel = BlogModel.GetInstance();

		var blogSpots:Array<BlogPost> = this.mBlogModel.GetBlogPosts();

		if(blogSpots.length <= 0){

			this.mBlogModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnBlogLoaded, this);
			this.mBlogModel.FetchBlogPosts();

		} else {

			this.OnBlogLoaded(null);
		}
	}

	private OnBlogLoaded(aEvent:MVCEvent):void {

		this.mBlogModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnBlogLoaded, this);

		var blogSpots:Array<BlogPost> = this.mBlogModel.GetBlogPosts();

		this.mLatestBlog = blogSpots[blogSpots.length - 1];

		document.getElementById("content-loading").innerHTML += this.mHomeView.RenderTemplate(this.mLatestBlog);

		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		this.mHomeView.AddClickControl(document.getElementById("home-video"));
		this.mHomeView.AddClickControl(document.getElementById("home-title-schedule"));
		this.mHomeView.AddClickControl(document.getElementById("home-blog-read"));

		this.mHomeView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		document.getElementById("home-blog-text").innerHTML += this.mLatestBlog.text;

		this.AddCloudsToElement("home-cloudContainer-1", 12);
		this.AddCloudsToElement("home-cloudContainer-2", 12);
		this.AddCloudsToElement("home-cloudContainer-3", 12);
		this.AddCloudsToElement("home-cloudContainer-4", 12);

		/* tslint:disable */
		if (window["twttr"] != null && window["twttr"].widgets != null) {
			window["twttr"].widgets.load();
		}
		/* tslint:enable */
	}

	private AddCloudsToElement(aElementId:string, aCloudCount:number):void {
		var element:HTMLElement = document.getElementById(aElementId);
		for (var i:number = 0; i < aCloudCount; i++) {
			element.innerHTML += "<div class='cloud'></div>";
		}
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id == "home-video") {

			this.OnVideoClicked(element);

		} else if(element.id == "home-title-schedule"){

			Router.GetInstance().Navigate("horaire");

		}else if(element.id == "home-blog-read"){

			Router.GetInstance().Navigate(this.mLatestBlog.slug);
		}
	}

	private OnVideoClicked(element:HTMLElement):void {

		element.className = "home-split";
		element.innerHTML = "<iframe width='100% height='100%' src='https://www.youtube.com/embed/p8-Sv0GKG-U?autoplay=1&rel=0'" +
							"frameborder='0' allowfullscreen></iframe>";

		this.mHomeView.RemoveClickControl(element);
	}
}
