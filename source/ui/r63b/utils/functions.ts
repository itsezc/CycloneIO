export const classNames = (classes: any) => {
	return Object.entries(classes)
			.filter(([key, value]) => value)
			.map(([key, value]) => key)
			.join(' ')
}

export const fullScreen = (state: boolean) => {

	const document: any = window.document
	const element: HTMLElement = document.documentElement


	if(state) {

		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (document.mozCancelFullScreen) { /* Firefox */
			document.mozCancelFullScreen()
		} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			document.webkitExitFullscreen()
		} else if (document.msExitFullscreen) { /* IE/Edge */
			document.msExitFullscreen()
		}

	} else {
		
		if (document.requestFullscreen) {
			document.requestFullscreen()

		} else if (document.mozRequestFullScreen) { /* Firefox */
			document.mozRequestFullScreen()

		} else if (document.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
			document.webkitRequestFullscreen()

		} else if (document.msRequestFullscreen) { /* IE/Edge */
			document.msRequestFullscreen()
		}
	}
}

export const dragElement = (element: HTMLElement | null) => {

	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	
	if(element == null){ 
		console.error("No element error"); return;
	}

	if (document.getElementById(element!.id + "_header")) {
		document.getElementById(element!.id + "_header")!.onmousedown = dragMouseDown;
	} else {
		element.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e: any) {
		e = e || window.event;
		e.preventDefault();
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e: any) {
		e = e || window.event;
		e.preventDefault();
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		element!.style.top = (element!.offsetTop - pos2) + "px";
		element!.style.left = (element!.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}