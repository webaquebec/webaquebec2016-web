import EConfig from "../main/EConfig";

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
	private mLatestBlogExcerpt:string;
	private mBlogPostMaximumLength:number = 100;

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mHomeView = new AbstractView();
		this.mHomeView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mHomeView.LoadTemplate("templates/home/home.html");

		this.HideTwitterMediaOnCardLoad();
	}

	public Destroy():void {

		var homeHTMLElement:HTMLElement = document.getElementById("home-view");

		document.getElementById("content-current").removeChild(homeHTMLElement);

		this.mHomeView.Destroy();
		this.mHomeView = null;
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		this.mHomeView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		var description:string = "Le rendez-vous incontournable des passionnés du numérique! Du 6 au 8 avril 2016 au Terminal du Port de Québec.";

		document.title = EConfig.TITLE;
		document.getElementsByName('og:title')[0].setAttribute('content', EConfig.TITLE);
		document.getElementsByName('description')[0].setAttribute('content', description);
		document.getElementsByName('og:description')[0].setAttribute('content', description);
		document.getElementsByName("og:url")[0].setAttribute("content", window.location.href);

		this.mBlogModel = BlogModel.GetInstance();

		var blogPosts:Array<BlogPost> = this.mBlogModel.GetBlogPosts();

		if(blogPosts.length <= 0){

			this.mBlogModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnBlogLoaded, this);
			this.mBlogModel.FetchBlogPosts();

		} else {

			this.OnBlogLoaded(null);
		}
	}

	private HideTwitterMediaOnCardLoad():void {
		window['twttr'].ready(function (twttr) {
				window['twttr'].events.bind('rendered', function(event) {
					var container:HTMLElement = document.getElementById('home-twitter-timeline');
					var iFrames:NodeListOf<HTMLElement> = container.getElementsByTagName('iframe');
					if(iFrames.length > 0) {
					var iFrame:any = iFrames[0];
					var iFrameContent:any = iFrame.contentDocument || iFrame.contentWindow.document;
					var mediaContainers:NodeListOf<HTMLElement> = iFrameContent.getElementsByClassName('timeline-Tweet-media');
					if(mediaContainers.length > 0) {
					mediaContainers[0].style.display = 'none';
					}
					}
					});
				});
	}

	private OnBlogLoaded(aEvent:MVCEvent):void {

		this.mBlogModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnBlogLoaded, this);

		var blogPosts:Array<BlogPost> = this.mBlogModel.GetBlogPosts();

		this.mLatestBlog = blogPosts[0];
		this.mLatestBlogExcerpt = "";

		document.getElementById("content-loading").innerHTML += this.mHomeView.RenderTemplate(this.mLatestBlog);

		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));

		this.mHomeView.AddClickControl(document.getElementById("home-video"));
		this.mHomeView.AddClickControl(document.getElementById("home-title-schedule"));
		this.mHomeView.AddClickControl(document.getElementById("home-blog-read"));

		this.mHomeView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		var blogTextExcerpt:HTMLDivElement = <HTMLDivElement>document.getElementById("home-blog-text");

		blogTextExcerpt.innerHTML += this.mLatestBlog.text;

		this.mLatestBlogExcerpt = blogTextExcerpt.textContent;

		if (this.mLatestBlog.text.length > this.mBlogPostMaximumLength) {
			this.mLatestBlogExcerpt = this.mLatestBlogExcerpt.substring(0, this.mBlogPostMaximumLength) + " ...";
		}

		blogTextExcerpt.innerHTML = "<p>" + this.mLatestBlogExcerpt + "</p>";

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

			Router.GetInstance().Navigate("!horaire");

		}else if(element.id == "home-blog-read"){

			Router.GetInstance().Navigate("!" + this.mLatestBlog.slug);
		}
	}

	private OnVideoClicked(element:HTMLElement):void {

		element.className = "home-split";
		element.innerHTML = "<iframe width='100%' height='100%' src='https://www.youtube.com/embed/YKwCfcNmQXs?autoplay=1&rel=0'" +
			"frameborder='0' allowfullscreen></iframe>";

		this.mHomeView.RemoveClickControl(element);
	}
}
