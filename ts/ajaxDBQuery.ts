'use strict';

function ajaxDBQuery(element, callback=()=>{}) {
	
	console.log(element);
	
	if (element.dataset.url == null || element.dataset.db == null || element.dataset.table == null || element.dataset.columns == null) {
		element.innerText = "400 (Bad Request)";
		return;
	} else {
		const xhr = new XMLHttpRequest(),
			method = "POST",
			url = element.dataset.url;
		var data = {
			"db": element.dataset.db,
			"table": element.dataset.table,
			"columns": element.dataset.columns,
			"selection": element.dataset.selection,
			"order_by": element.dataset.order_by,
			"direction": element.dataset.direction,
			"offset": parseInt(element.dataset.page, 10),
			"limit": parseInt(element.dataset.limit, 10),
		};
		var data = JSON.stringify(data);

		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function () {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status == 200) {
					// retrieve data
					//console.log(xhr.responseText);
					callback(element, xhr.responseText);
				} else if (xhr.status >= 500) {
					// internal server error
					element.innerText = xhr.statusText;
				} else if (xhr.status >= 402 && xhr.status <= 420) {
					// error
					element.innerText = xhr.statusText;
				} else if (xhr.status == 400 || xhr.status == 401) {
					// bad request & unauthorized error
					element.innerText = xhr.statusText;
				}
			}
		};
		xhr.send(data);
	}
}

export default ajaxDBQuery;