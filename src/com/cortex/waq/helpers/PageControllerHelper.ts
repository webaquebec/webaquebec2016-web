export default class PageControllerHelper {

	private static mUniqueCount:number = 0;

	public static GetUniqueNumber():number {
		return ++PageControllerHelper.mUniqueCount;
	}

	public static RenameElement(aElementId:string):HTMLElement {
		var element:HTMLElement = document.getElementById(aElementId);
		var newElementId = aElementId + PageControllerHelper.GetUniqueNumber();
		element.id = newElementId;
		return element;
	}

}
