import MVCEvent from "../../core/mvc/event/MVCEvent";
import AbstractModel from "../../core/mvc/AbstractModel";

import BlogPost from "./data/BlogPost";

import Profile from "../profiles/data/Profile";

import { LazyLoader } from "cortex-toolkit-js-net";

import EConfig from "../main/EConfig";
import Spinner from "../spinner/Spinner";

export default class BlogModel extends AbstractModel {

	private static mInstance:BlogModel;

	private mBlogPosts:Array<BlogPost>;
	private mAuthors:Array<Profile>;

	constructor() {

		super();

		this.mBlogPosts = [];
		this.mAuthors = [];
	}

	public FetchBlogPosts():void {

        Spinner.GetInstance().Show();
		if (this.mAuthors.length <= 0) {

			var promise = LazyLoader.loadJSON(EConfig.BASE_URL + "users");
			promise.then((results) => { this.OnAuthorURLLoaded(results); });

		} else {

			this.Fetch(EConfig.BASE_URL + "posts?per_page=" + EConfig.PER_PAGE);
		}
	}

	private OnAuthorURLLoaded(aJSONData:any):void {

		var json:Array<any> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var author:Profile = new Profile();

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
	}

	public OnJSONLoadSuccess(aJSONData:any, aURL:string):void {

		var json:Array<any> = aJSONData;

		for (var i:number = 0, iMax:number = json.length; i < iMax; i++) {

			var blogPost:BlogPost = new BlogPost();

			blogPost.FromJSON(json[i]);

			blogPost.profile = this.GetAuthorByID(blogPost.profileID);

			this.mBlogPosts.push(blogPost);
		}

		for (var i:number = 0, iMax = this.mBlogPosts.length; i < iMax; i++) {

			var blogPost:BlogPost = this.mBlogPosts[i];

			if (blogPost.thumbnailID == 0){

				this.OnImageURLLoaded({id:"0", source_url:"img/blog/blog-placeholder-1.jpg"})

			} else {

				var promise:any = LazyLoader.loadJSON(EConfig.BASE_URL + "media/" + blogPost.thumbnailID);
				promise.then((results) => { this.OnImageURLLoaded(results); });
			}
		}
	}

	private GetAuthorByID(aProfileID:number):Profile {

		for(var i:number = 0,  max = this.mAuthors.length; i < max; i++) {

			if(this.mAuthors[i].profileID == aProfileID){

				return this.mAuthors[i];
			}
		}

		return null;
	}

	private OnImageURLLoaded(aJSONData:any) {

		for(var i:number = 0, max = this.mBlogPosts.length; i < max; i ++){

			var blogPost:BlogPost = this.mBlogPosts[i];

			if(blogPost.thumbnailID == aJSONData.id && !blogPost.ready){

				blogPost.thumbnail = aJSONData.source_url;
				blogPost.ready = true;
				break;
			}
		}

		var allImageLoaded:boolean = true;

		for(var i:number = 0, max = this.mBlogPosts.length; i < max; i ++){

			if(!this.mBlogPosts[i].ready){
				allImageLoaded = false;
				break;
			}
		}

		if(allImageLoaded){

			super.OnJSONLoadSuccess(this.mBlogPosts, EConfig.BASE_URL + "posts");
            Spinner.GetInstance().Hide();
			this.DispatchEvent(new MVCEvent(MVCEvent.JSON_LOADED));
		}
	}

	public GetBlogPosts():Array<BlogPost> {
		return this.mBlogPosts.slice(0, this.mBlogPosts.length);
	}

	public static GetInstance():BlogModel {

		if (BlogModel.mInstance == null){

			BlogModel.mInstance = new BlogModel();
		}

		return BlogModel.mInstance;
	}
}
