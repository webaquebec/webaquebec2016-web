import ComponentEvent from "../../core/component/event/ComponentEvent";
import ListComponent from "../../core/component/ListComponent";

import MouseTouchEvent from "../../core/mouse/event/MouseTouchEvent";

import MVCEvent from "../../core/mvc/event/MVCEvent";
import EventDispatcher from "../../core/event/EventDispatcher";
import AbstractView from "../../core/mvc/AbstractView";

import BlogPost from "./data/BlogPost";
import BlogModel from "./BlogModel";

export default class BlogController extends EventDispatcher {

	private mBlogModel:BlogModel;
	private mBlogView:AbstractView;

	private mListComponent:ListComponent;
	private mTotalBlogPosts:number;

	private mArticleView:HTMLElement;
	private mArticleTitleView:HTMLElement;
	private mArticleTextView:HTMLElement;

	constructor() {
		super();
		this.Init();
	}

	public Init():void {
		this.mBlogModel = new BlogModel();
		this.mBlogModel.AddEventListener(MVCEvent.JSON_LOADED, this.OnJsonLoaded, this);
		this.mTotalBlogPosts = 0;
	}

	public Destroy():void {
		var scheduleHTMLElement:HTMLElement = document.getElementById("blog-view");
		document.getElementById("content-current").removeChild(scheduleHTMLElement);

		this.mBlogView.Destroy();
		this.mBlogView = null;
	}

	private OnJsonLoaded(aEvent:MVCEvent):void {
		this.mBlogModel.RemoveEventListener(MVCEvent.JSON_LOADED, this.OnJsonLoaded, this);

		this.mBlogView = new AbstractView();
		this.mBlogView.AddEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.mBlogView.LoadTemplate("templates/blog/blog.html");
	}

	private OnTemplateLoaded(aEvent:MVCEvent):void {
		document.getElementById("content-loading").innerHTML += this.mBlogView.RenderTemplate({});
		this.mBlogView.RemoveEventListener(MVCEvent.TEMPLATE_LOADED, this.OnTemplateLoaded, this);
		this.DispatchEvent(new MVCEvent(MVCEvent.TEMPLATE_LOADED));
		this.FindViews();

		this.mBlogView.AddClickControl(document.getElementById("article-return"));
		this.mBlogView.AddEventListener(MouseTouchEvent.TOUCHED, this.OnScreenClicked, this);

		this.mListComponent = new ListComponent();
		this.mListComponent.Init("blog-grid");
		this.CreateBlogPosts();
	}

	private FindViews():void {
		this.mArticleView = document.getElementById("blog-view-article");
		this.mArticleTitleView = document.getElementById("article-title-el");
		this.mArticleTextView = document.getElementById("article-text");
	}

	private CreateBlogPosts():void {
		this.mListComponent.AddEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		var blogPosts:Array<BlogPost> = this.mBlogModel.GetBlogPosts();
		this.mTotalBlogPosts = blogPosts.length;
		for (var i:number = 0, iMax:number = this.mTotalBlogPosts; i < iMax; i++) {
			var blogPostView:AbstractView = new AbstractView();
			this.mListComponent.AddComponent(blogPostView, "templates/blog/blogCell.html", blogPosts[i]);
		}
	}

	private AllItemsReady():void {
		this.mListComponent.RemoveEventListener(ComponentEvent.ALL_ITEMS_READY, this.AllItemsReady, this);
		for (var i:number = 0, iMax:number = this.mTotalBlogPosts; i < iMax; i++) {
			this.mBlogView.AddClickControl(document.getElementById("blog-cell-" + i.toString()));
		}
		this.LayoutBlogPosts();
	}

	private LayoutBlogPosts():void {
		var grid:HTMLElement = document.getElementById("blog-grid");
		var masonry:Masonry = new Masonry(grid, {itemSelector:".blog-cell"});
		ImagesLoaded(grid, function() {
			masonry.layout();
		});
	}

	private OnScreenClicked(aEvent:MouseTouchEvent):void {
		var element:HTMLElement = <HTMLElement>aEvent.currentTarget;

		if (element.id === "article-return") {

			this.CloseArticle();

		} else if (element.id.indexOf("blog-cell-") >= 0) {

			this.OpenArticle(element);
		}
	}

	private OpenArticle(aElement:HTMLElement):void {
		document.getElementById("blog-view-article").className = "blog-split blog-split-visible";
		var cellId:string = aElement.id.split("blog-cell-")[1];
		var blogPost:BlogPost = <BlogPost>this.mListComponent.GetDataByID(cellId);
		this.FillArticleDetails(blogPost);
	}

	private FillArticleDetails(aBlogPost:BlogPost):void {
		this.mArticleView.scrollTop = 0;
		this.mArticleTitleView.innerHTML = aBlogPost.title;
		this.mArticleTextView.innerHTML = aBlogPost.text;
	}

	private CloseArticle():void {
		document.getElementById("blog-view-article").className = "blog-split blog-split-hidden";
	}

}
