export default class AnalyticHelper {

	public static SendEvent():void {
		if(window['ga'] !== undefined) {
			window['ga']("send", "pageview", {
				'page': location.pathname + location.search + location.hash
			});
		}
	}

}
