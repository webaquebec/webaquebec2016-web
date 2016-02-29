import EConfig from "../main/EConfig";

import ComponentEvent from "../../core/component/event/ComponentEvent";
import ListComponent from "../../core/component/ListComponent";
import ComponentBinding from "../../core/component/ComponentBinding";

import UpdateManager from "../../core/update/UpdateManager";
import IUpdatable from "../../core/update/IUpdatable";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import { Router } from "cortex-toolkit-js-router";

import BlogPost from "./data/BlogPost";
import BlogModel from "./BlogModel";

declare var FB:any;

export default class BlogController extends EventDispatcher implements IUpdatable{

	private mBlogModel:BlogModel;

	private mBlogView:AbstractView;
	private mBlogPostView:AbstractView;

	private mBlogPosts:Array<BlogPost>;

	private mBlogGrid:HTMLElement;

	private mCurrentBlogPost:BlogPost;

	private mListComponent:ListComponent;
	private mTotalBlogPosts:number;

	private mDescription:string;

	private mReady:boolean;

	constructor() {

		super();

		this.Init();
	}

	public Init():void {

		this.mBlogModel = BlogModel.GetInstance();

		this.mBlogModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);

		this.mBlogPosts = this.mBlogModel.GetBlogPosts();

		if(this.mBlogPosts.length > 0){

			this.OnJSONLoaded(null);
		}

		var title:string = 'Blogue' + EConfig.TITLE_SEPARATOR + EConfig.TITLE;
		this.mDescription = "Suivez les coulisses du Web à Québec 2016 et préparez-vous à maximiser votre expérience.";

		document.title = title;
		document.getElementsByName("og:title")[0].setAttribute("content", title);
		document.getElementsByName('description')[0].setAttribute('content', this.mDescription);
		document.getElementsByName("og:description")[0].setAttribute("content", this.mDescription);
		document.getElementsByName('og:image')[0].setAttribute('content', "http://webaquebec.org/img/share-fb.jpg");
		document.getElementsByName("og:url")[0].setAttribute("content", window.location.href);

		this.mTotalBlogPosts = 0;
	}

	public Destroy():void {

		UpdateManager.Unregister(this);

		var scheduleHTMLElement:HTMLElement = document.getElementById("blog-view");

		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		if(this.mBlogPostView){
			this.mBlogPostView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnPostTemplateLoaded, this);
			this.mBlogPostView.Destroy();
		}

		this.mBlogPostView = null;

		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		this.mListComponent.Destroy();
		this.mListComponent = null;

		this.mBlogView.RemoveEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);
		this.mBlogView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mBlogView.Destroy();
		this.mBlogView = null;

		this.mBlogModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);
		this.mBlogModel = null;

		this.mReady = false;

		this.mBlogPosts.length = 0;
		this.mBlogPosts = null;

		this.mCurrentBlogPost = null;
	}

	private OnJSONLoaded(aEvent:MVCEvent):void {

		this.mBlogModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJSONLoaded, this);

		this.mBlogView = new AbstractView();
		this.mBlogView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mBlogView.LoadTemplate("templates/blog/blog.html");
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {

		this.mBlogView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);

		document.getElementById("content-loading").innerHTML += this.mBlogView.RenderTemplate({});
        document.getElementById("header-content-title").innerHTML = "<h1>Blogue</h1>";

		this.mBlogView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent = new ListComponent();
		this.mListComponent.Init("blog-grid");

		this.CreateBlogPosts();
	}

	public IsReady():boolean{ return this.mReady; }

	private CreateBlogPosts():void {

		this.mBlogPosts = this.mBlogModel.GetBlogPosts();

		this.mTotalBlogPosts = this.mBlogPosts.length;

		for (var i:number = 0; i < this.mTotalBlogPosts; i++) {

			this.mListComponent.AddComponent(new ComponentBinding(new AbstractView(), this.mBlogPosts[i]));
		}

		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		this.mListComponent.LoadWithTemplate("templates/blog/blogCell.html");

		this.mReady = true;
	}

	private AllItemsReady():void {

		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);

		for (var i:number = 0; i < this.mTotalBlogPosts; i++) {

			this.mBlogView.AddClickControl(document.getElementById("blog-cell-" + i.toString()));
		}

		this.LayoutBlogPosts();
	}

	private LayoutBlogPosts():void {

		this.mBlogGrid = document.getElementById("blog-grid");
		var masonry:Masonry = new Masonry(this.mBlogGrid , {itemSelector:".blog-cell"});
		ImagesLoaded(this.mBlogGrid , function() {
			masonry.layout();
		});

		UpdateManager.Register(this);

		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {

		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id === "article-return") {

			document.title = 'Blogue' + EConfig.TITLE_SEPARATOR + EConfig.TITLE;

			Router.GetInstance().Navigate("!blogue");

		} else if (element.id.indexOf("blog-cell-") >= 0) {

			var cellId:string = element.id.split("blog-cell-")[1];

			var blogPost:BlogPost = <BlogPost>this.mListComponent.GetDataByID(cellId);

			Router.GetInstance().Navigate("!"+blogPost.slug);

		} else if (element.id === "article-prev") {

			this.LoadPreviousBlogPost();

		} else if (element.id === "article-next") {

			this.LoadNextBlogPost();

		} else if (element.id === "article-tw") {

			this.ShareTwitter();

		} else if (element.id === "article-fb") {

			this.ShareFacebook();

		} else if (element.id === "article-li") {

			this.ShareLinkedin();
		}
	}

	private ShareTwitter():void {

		window.open("https://twitter.com/share?text=" + encodeURIComponent(this.mCurrentBlogPost.title) +
														"&url=" + encodeURIComponent(window.location.href) +
														"&hashtags=WAQ2016,WAQ");
	}

	private ShareFacebook():void {

		console.log(window.location);

		FB.ui(	{
					method: "share",
					href: window.location.href,
					name: this.mCurrentBlogPost.title,
					caption: this.mCurrentBlogPost.title,
					description: this.mCurrentBlogPost.title
				},
				function(response){
					console.log(response);
				});
	}

	private ShareLinkedin():void {

		window.open("https://www.linkedin.com/shareArticle?mini=true" +
														"&url=" + encodeURIComponent(window.location.href) +
														"&summary=" + encodeURIComponent(this.mCurrentBlogPost.title) +
														"&source=LinkedIn");
	}

	private LoadPreviousBlogPost():void{

		var blogPostIndex:number = this.mBlogPosts.indexOf(this.mCurrentBlogPost);

		if (blogPostIndex == 0) { return; }

		Router.GetInstance().Navigate("!" + this.mBlogPosts[blogPostIndex - 1].slug);
	}

	private LoadNextBlogPost():void{

		var blogPostIndex:number = this.mBlogPosts.indexOf(this.mCurrentBlogPost);

		if (blogPostIndex == this.mBlogPosts.length - 1) { return; }

		Router.GetInstance().Navigate("!" + this.mBlogPosts[blogPostIndex + 1].slug);
	}

	public OpenArticle(aBlogPost:BlogPost):void {

		this.mCurrentBlogPost = aBlogPost;

		var description:string = this.mCurrentBlogPost.description ? this.mCurrentBlogPost.description : this.mDescription;

		document.title = this.mCurrentBlogPost.title;
		document.getElementsByName('og:title')[0].setAttribute('content', this.mCurrentBlogPost.title);
		document.getElementsByName('description')[0].setAttribute('content', description);
		document.getElementsByName('og:description')[0].setAttribute('content', description);
		document.getElementsByName("og:url")[0].setAttribute("content", window.location.href);
		document.getElementsByName("og:image")[0].setAttribute("content", this.mCurrentBlogPost.thumbnail);

		this.mBlogPostView = new AbstractView();
		this.mBlogPostView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnPostTemplateLoaded, this);
		this.mBlogPostView.LoadTemplate("templates/blog/blogPost.html");
	}

	private OnPostTemplateLoaded(aEvent:MVCEvent):void {

		this.mBlogPostView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnPostTemplateLoaded, this);

		var blogPostElement:HTMLElement = document.getElementById("blog-view-article");

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
	}

	public CloseArticle():void {

		document.getElementById("blog-view-article").className = "blog-split blog-split-hidden";

		var blogPostElement:HTMLElement = document.getElementById("blog-view-article");
		blogPostElement.innerHTML = "";

		if(this.mBlogPostView){
			this.mBlogPostView.Destroy();
		}
		this.mBlogPostView = null;
	}

	public Update():void {

		if(this.mBlogGrid.style.height != "100%"){

			this.mBlogGrid.style.height = "100%";
		}
	}
}
