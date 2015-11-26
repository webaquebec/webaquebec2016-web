import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import BlogPost from "./data/BlogPost";

export default class BlogModel extends AbstractModel {

	private mBlogPosts:Array<BlogPost>;

	constructor() {
		super();

		this.mBlogPosts = [];
		this.CreateBlogPosts();
	}

	private CreateBlogPosts():void {
		this.Fetch("json/waq/blog_posts.json");
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {
		super.OnJSONLoadSuccess(aJSONData, aURL);

		var json:Array<Object> = aJSONData;
		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {
			var blogPost:BlogPost = new BlogPost();
			blogPost.FromJSON(json[i]);
			this.mBlogPosts.push(blogPost);
		}

		this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
	}

	public GetBlogPosts():Array<BlogPost> {
		return this.mBlogPosts;
	}

}
