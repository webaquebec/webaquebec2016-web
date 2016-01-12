import EventDispatcher from "../../core/event/EventDispatcher";

export default class Spinner extends EventDispatcher {

    private static mInstance:Spinner;

    private mContentCurrent:HTMLElement;
    private mContentLoading:HTMLElement;

	constructor() {

		super();
	}

    private SetContent():void {

        if(this.mContentCurrent == null) {
            this.mContentCurrent = document.getElementById("content-current");
        }

        if(this.mContentLoading == null) {
            this.mContentLoading = document.getElementById("content-loading");
        }
    }

    public Show():void {

        this.SetContent();

        if (this.mContentCurrent != null && this.mContentLoading != null) {

            this.mContentCurrent.classList.add("is-showingSpinner");
            this.mContentLoading.classList.add("is-showingSpinner");
        }
    }

    public Hide():void {

        this.SetContent();

        if (this.mContentCurrent != null && this.mContentLoading != null) {

            this.mContentCurrent.classList.remove("is-showingSpinner");
            this.mContentLoading.classList.remove("is-showingSpinner");
        }
    }

    public static GetInstance():Spinner {

		if(Spinner.mInstance == null) {

			Spinner.mInstance = new Spinner();
		}

		return Spinner.mInstance;
	}

}
