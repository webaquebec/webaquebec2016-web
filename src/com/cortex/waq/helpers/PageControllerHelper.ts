export default class PageControllerHelper {

	private static mUniqueCount:number = 0;

	public static GetUniqueId():number {
		return ++PageControllerHelper.mUniqueCount;
	}

	public static AssignUniqueId(aElementId:string):string {
		var element:HTMLElement = document.getElementById(aElementId);
		var newElementId = aElementId + PageControllerHelper.GetUniqueId();
		element.id = newElementId;
		return newElementId;
	}

}
