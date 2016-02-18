export default class PageControllerHelper {

	private static mUniqueCount:number = 0;

	public static GetUniqueNumber():number {
		return ++PageControllerHelper.mUniqueCount;
	}

	public static RenameAndReturnElement(aElementId:string):HTMLElement {
		var element:HTMLElement = document.getElementById(aElementId);
		var newElementId = aElementId + PageControllerHelper.GetUniqueNumber();
		element.id = newElementId;
		return element;
	}

	public static RemoveHTML(string:string):string {
		var element:HTMLElement = document.createElement('div');
		element.innerHTML = string;
		return element.textContent || element.innerText || '';
	}

}
