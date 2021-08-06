'use strict';

function ajaxDBQuery(element, callback=()=>{}) {
	console.log("ajaxDBQuery");
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
			"inner_join": element.dataset.inner_join,
			"where": element.dataset.where,
			"order_by": element.dataset.order_by,
			"direction": element.dataset.direction,
			"limit": parseInt(element.dataset.limit, 10),
			"offset": parseInt(element.dataset.offset, 10)
		};
		var data = JSON.stringify(data);

		xhr.open(method, url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function () {
			if(this.readyState === XMLHttpRequest.DONE) {
				if (this.status == 200) {
					// retrieve data
					callback(element, this.responseText);
				} else if (this.status >= 500) {
					// internal server error
					element.innerText = this.statusText;
				} else if (this.status >= 402 && this.status <= 420) {
					// error
					element.innerText = this.statusText;
				} else if (this.status == 400 || this.status == 401) {
					// bad request & unauthorized error
					element.innerText = this.statusText;
				}
			}
		}
		xhr.send(data);
	}
}

export default ajaxDBQuery;